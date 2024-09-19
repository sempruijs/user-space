use sqlx::postgres::PgPoolOptions;
use std::env;
use dotenv::dotenv;

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    // Load environment variables from .env file
    dotenv().ok();

    // Get the database URL from the environment
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Create a connection pool
    let pool = PgPoolOptions::new()
        .max_connections(5)  // Set the max number of connections
        .connect(&database_url)
        .await?;

    // Fetch users from the database
    let rows = sqlx::query!(
        r#"
        SELECT id, name, age, email
        FROM users
        "#
    )
    .fetch_all(&pool)
    .await?;

    // Print the results
    for row in rows {
        println!("Found user: {})", row.name.unwrap() );
    }

    Ok(())
}