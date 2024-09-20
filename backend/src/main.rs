use dotenv::dotenv;
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;

//TODO: make age u32
#[derive(Debug)]
struct User {
    name: String,
    age: i32,
    email: String,
}

async fn get_users(pool: &PgPool) -> Result<Vec<User>, sqlx::Error> {
    let users = sqlx::query_as!(User, r#"SELECT name, age, email FROM users"#)
        .fetch_all(pool)
        .await?;

    Ok(users)
}

async fn add_user(pool: &PgPool, u: &User) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        INSERT INTO users (name, age, email)
        VALUES ($1, $2, $3)
        "#,
        u.name,
        u.age,
        u.email
    )
    .execute(pool)
    .await?;

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new().connect(&database_url).await?;

    let users = get_users(&pool).await?;
    println!("{:#?}", users);

    // let new_user = User {
    //     name: String::from("mama"),
    //     age: 30,
    //     email: String::from("mama@example.com"),
    // };
    // add_user(&pool, &new_user).await?;
    Ok(())
}
