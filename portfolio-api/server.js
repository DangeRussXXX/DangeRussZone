import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";


// Load environment variables
dotenv.config();


const app = express();

const { Pool } = pg;


// Middleware
app.use(cors());

app.use(express.json());

app.use(express.static("public"));




// PostgreSQL Connection

const pool = new Pool({

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    database: process.env.DB_NAME,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD

});





// ==========================================
// TEST DATABASE CONNECTION
// ==========================================

app.get("/api/test", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT NOW();"
        );


        res.json(result.rows);


    } catch(error) {


        console.error(
            "Database Error:",
            error
        );


        res.status(500).json({

            error:error.message

        });

    }

});







// ==========================================
// DATABASE COUNT
// ==========================================

app.get("/api/count", async (req,res)=>{


    try {


        const result = await pool.query(`

            SELECT COUNT(*)

            FROM superhero.superhero;

        `);



        res.json(result.rows);



    } catch(error) {


        console.error(error);


        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================================
// LIST TABLES
// ==========================================

app.get("/api/tables", async(req,res)=>{


    try {


        const result = await pool.query(`

            SELECT table_name

            FROM information_schema.tables

            WHERE table_schema='superhero'

            ORDER BY table_name;

        `);



        res.json(result.rows);



    } catch(error){


        console.error(error);


        res.status(500).json({

            error:error.message

        });


    }


});








// ==========================================
// HERO DATABASE
// ==========================================

app.get("/api/heroes", async(req,res)=>{


    try {


        const result = await pool.query(`


        SELECT


            s.id,


            s.superhero_name,


            s.full_name,



            g.gender,



            eye.colour AS eye_colour,


            hair.colour AS hair_colour,


            skin.colour AS skin_colour,



            r.race,



            p.publisher_name,



            a.alignment,



            s.height_cm,


            s.weight_kg



        FROM superhero.superhero s



        LEFT JOIN superhero.gender g

            ON s.gender_id = g.id



        LEFT JOIN superhero.colour eye

            ON s.eye_colour_id = eye.id



        LEFT JOIN superhero.colour hair

            ON s.hair_colour_id = hair.id



        LEFT JOIN superhero.colour skin

            ON s.skin_colour_id = skin.id



        LEFT JOIN superhero.race r

            ON s.race_id = r.id



        LEFT JOIN superhero.publisher p

            ON s.publisher_id = p.id



        LEFT JOIN superhero.alignment a

            ON s.alignment_id = a.id



        ORDER BY s.id



        LIMIT 100;



        `);



        res.json(result.rows);



    } catch(error){


        console.error(

            "Hero Query Error:",

            error

        );



        res.status(500).json({

            error:error.message

        });



    }


});








// ==========================================
// SEARCH HEROES
// ==========================================

app.get("/api/search", async(req,res)=>{


    try {


        const name =
            req.query.name;



        const result = await pool.query(`


        SELECT


            s.id,


            s.superhero_name,


            s.full_name,


            p.publisher_name,


            a.alignment,


            r.race,


            s.height_cm,


            s.weight_kg



        FROM superhero.superhero s



        LEFT JOIN superhero.publisher p

            ON s.publisher_id = p.id



        LEFT JOIN superhero.alignment a

            ON s.alignment_id = a.id



        LEFT JOIN superhero.race r

            ON s.race_id = r.id



        WHERE LOWER(s.superhero_name)

        LIKE LOWER($1)



        ORDER BY s.superhero_name



        LIMIT 50;



        `,[

            `%${name}%`

        ]);



        res.json(result.rows);



    } catch(error){


        console.error(error);


        res.status(500).json({

            error:error.message

        });



    }


});







// ==========================================
// START SERVER
// ==========================================

const PORT =
    process.env.PORT || 3000;



app.listen(PORT,()=>{


    console.log(

        `Portfolio API running on port ${PORT}`

    );


});