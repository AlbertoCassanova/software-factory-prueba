import { supabase } from "../utils/supabase/client"

export async function GET(request: Request){
  const {data, count} = await supabase.from('lista').select('*', { count: 'exact'})
  return Response.json([{
    "cantidad": count,
    "lista": data  
  }])
}