import fs from 'fs';
console.log("Reading .env file from:", process.cwd());
console.log("Contents of .env:", fs.readFileSync('.env', 'utf8'));
import 'dotenv/config';

import { createClient } from "@supabase/supabase-js";

async function diagnoseSupabaseTables() {
  console.log("Attempting to connect to Supabase and check for 'user_data' table...");

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("ERROR: Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are not set.");
    console.error("Please ensure these are configured in your .env file.");
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Try to select one row from user_data
    const { data, error } = await supabase.from("user_data").select("*").limit(1);

    if (error) {
      if (error.message.includes("does not exist")) {
        console.error("\nERROR: The 'user_data' table does NOT exist in your Supabase project.");
        console.error("Please ensure the SQL script to create 'user_data' has been successfully run on this specific Supabase project.");
      } else {
        console.error("Error querying 'user_data':", error.message);
      }
      return;
    }

    console.log("SUCCESS: The 'user_data' table exists and is accessible!");
    if (data && data.length > 0) {
      console.log("Sample row:", data[0]);
    } else {
      console.log("The 'user_data' table is empty, but it exists.");
    }
  } catch (e) {
    console.error("An unexpected error occurred during diagnosis:", e.message);
    console.error("Ensure all Supabase environment variables are set correctly.");
  }
}

diagnoseSupabaseTables();

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "[set]" : "[not set]");
