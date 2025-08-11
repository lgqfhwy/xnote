const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('Setting up database schema...')

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Note: This is a simplified approach. In production, you should use proper migration tools
    console.log(
      'Please execute the following SQL in your Supabase Dashboard SQL Editor:'
    )
    console.log('=' * 50)
    console.log(schema)
    console.log('=' * 50)

    console.log('\nDatabase setup instructions:')
    console.log(
      '1. Go to your Supabase Dashboard: https://lsayztyjqurdszzrjhtt.supabase.co'
    )
    console.log('2. Navigate to SQL Editor')
    console.log('3. Create a new query')
    console.log('4. Copy and paste the SQL schema above')
    console.log('5. Execute the query')
    console.log(
      '\nAlternatively, you can find the schema in: supabase/schema.sql'
    )
  } catch (error) {
    console.error('Error setting up database:', error.message)
    process.exit(1)
  }
}

setupDatabase()
