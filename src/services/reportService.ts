import { supabase } from "@/lib/supabase"

export const GetAllReports = async() => {
    await supabase.from("reports").select("")
}