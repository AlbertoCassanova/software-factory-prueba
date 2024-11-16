"use client"
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { supabase } from './utils/supabase/client';
import { Table } from "@nextui-org/react";
import Image from 'next/image';

const Lista = () => {
  const [lista, setLista] = useState<Array<any>>([])
  const [count, setCount] = useState<number>(0)
  useEffect(()=> {
      getLista();
  }, [])
  const getLista = async() => {
    const rs = await axios.get('/api');
    setCount(rs.data.count)
    setLista(rs.data[0].lista)
  }
  const formatUrl = (url: string) : string => {
    const formated = JSON.parse(url);
    return formated.publicUrl;
  }
  return count != 0  &&(
    <>
      <table>
        <thead>
          <td>Identificador</td>
          <td>Nombre</td>
          <td>Descripcion</td>
        </thead>
        <tbody>
          {lista && lista.map((e, key) => (
            <tr key={key}>
              <td>{e.identificador}</td>
              <td>{e.nombre_producto}</td>
              <td>{e.descripcion}</td>
              <td>
                <Image
                  src={formatUrl(e.imagen)}
                  alt='imagen'
                  width={60}
                  height={60}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const Formulario = () => {
  const imageInput = useRef();
  const [ identificador, setIdentificador ] = useState<string>('');
  const [ nombre, setNombre ] = useState<string>('');
  const [ descripcion, setDescripcion] = useState<string>('');
  const handleSubmit = async() => {
    if (identificador == '' || nombre == '' || descripcion == '') {
      alert("Rellene todos los campos")
    }
    else {
      if (imageInput.current) {
        // @ts-ignore
        let img = imageInput.current.files[0]
        if(img == undefined){
          alert("Suba una imagen valida")
        }
        else{
          console.log(img);
          const { data: image, error: uploadError } = await supabase.storage.from('productos').upload(`${img.name}`, img);
          if (uploadError) {
            throw uploadError;
          }
          if (image) {
            const { data: imgUrl } = await supabase.storage.from('productos').getPublicUrl(`${img.name}`);
            await supabase.from('lista').insert([
              {
                identificador: identificador,
                nombre_producto: nombre,
                descripcion: descripcion,
                imagen: imgUrl
              }
            ]);
            window.location.reload()
          }
        }
      }
    }
  }
  return (
    <div>
      <h2>Registrar productos</h2>
      <form>
        <div>
          <label>Identificador </label>
          <input type="text" className="border-2 rounded-md" onChange={(e) => setIdentificador(e.target.value)} />
        </div>
        <div>
          <label>Nombre del producto </label>
          <input type="text" className="border-2 rounded-md" onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div>
          <label>Descripcion del producto </label>
          <input type="text" className="border-2 rounded-md"  onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div>
          <label>Imagen del producto </label>
          <input type="file" ref={imageInput} className="border-2 rounded-md" />
        </div>
        <button onClick={handleSubmit} type="button" className="bg-green-500 p-2 rounded-md text-white">Aceptar</button>
      </form>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <div className="p-4 flex flex-col">
        <Formulario />
        <Lista />
      </div>
    </div>
  );
}
