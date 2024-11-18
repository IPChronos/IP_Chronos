from supabase import create_client, Client

SUPABASE_URL = "https://gfmwqcirgxwrlcqpqpte.supabase.co"  # Supabase project URL
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmbXdxY2lyZ3h3cmxjcXBxcHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NDY0NzksImV4cCI6MjA0NzQyMjQ3OX0.ORDS3GtCgdhegJasPe_bBeT1bKVzI__HAVQGRx2q4q4"             # Supabase service role or anon key

def connect_to_supabase() -> Client:
    """
    Connect to Supabase and return the client instance.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL and Key must be provided!")
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase

'''
def main():
    # Connect to Supabase
    supabase = connect_to_supabase()
    print("Connected to Supabase!")

    # Example: Fetch data from a table
    try:
        response = supabase.table("profesor").select("*").execute()
        if response.data:
            print("Data fetched successfully:", response.data)
        else:
            print("No data found or an error occurred.")
    except Exception as e:
        print("Error while fetching data:", e)


if __name__ == "__main__":
    main()
'''