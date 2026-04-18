import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kntkigijruzonpkwhqld.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudGtpZ2lqcnV6b25wa3docWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQ3NjgsImV4cCI6MjA5MjAxMDc2OH0.dDsoL2ruBoIrI8X8frCzKi5Dm6cxCCk2F4-PzCW3w6I';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'nelcimar.admin2@gmail.com',
    password: 'Amand@10'
  });
  if (error) {
    console.log("LOGIN ERROR: ", JSON.stringify(error, null, 2));
  } else {
    console.log("LOGIN SUCCESS: ", data.user.email);
  }
}
test();
