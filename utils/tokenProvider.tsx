import { supabase } from '~/utils/supabase'



export const tokenProvider  = async () =>{
    
    const {data} = await supabase.functions.invoke('stream-token')
    console.log(data)

    return( data.token )
}

