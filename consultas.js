const { Pool } = require("pg"); 

const config = {   
    user: "postgres",
    host: "localhost",
    password: "admin",
    database: "skatepark",
    port: 5432,
    max: 20,
    min: 5,
    idleTimeoutMillis: 5000,
    connetionTimeoutMillis: 2000,
}

const pool = new Pool(config);

const insertarParticipante = async (participante) => {
    const consulta = {
        text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) values($1, $2, $3, $4, $5, $6, $7);",
        values: participante,
    };
    try {
        const result = await pool.query(consulta);
        //console.log(result);
        return result.rowCount;
    } catch (error) {
        //console.log(error.code);
        throw error;
    }
};

let getParticipantes = async () => {
    try {
        const result = await pool.query(`SELECT id, email, nombre, password, anos_experiencia, especialidad, foto, estado FROM skaters`);
        //console.log(result.rows);
        return result.rows;
    } catch (e) {
        throw e;
    }
}

let getValidacion = async ( email, password ) => {
    try {
        const consulta = {
            text: "SELECT * FROM skaters WHERE email = $1 AND password = $2;",
            values: [email,password],
        };
        const result = await pool.query(consulta);
        return result.rows[0];
    }catch(e){
        throw e;
    }
};

let actualizarParticipante = async ( participante ) => {
    try {
        let consulta = {
            text: "UPDATE skaters SET nombre = $2, password = $3, anos_experiencia = $4, especialidad = $5 WHERE email = $1 RETURNING *",
            values: participante
        }
        //console.log(params);
        const result = await pool.query(consulta);
        //console.log(result);
        return result.rowCount;
    } catch (e) {
        throw e;
    }
};

let setParticipanteStatus = async ( id, auth) => {
    try {
        let consulta = {
            text: "UPDATE skaters SET estado = $2  WHERE id = $1 RETURNING *",
            values: [id,auth]
        }
        //console.log(params);
        const result = await pool.query(consulta);
        console.log(result.rows[0].estado);
        return result.rowCount;
    } catch (e) {
        throw e;
    }

}


let deleteParticipante = async ( email ) => {
    let consulta = {
        text: `DELETE from skaters WHERE email = $1;`,
        values: [email]
    }
    try {
        const result = await pool.query(consulta);
        //console.log(result);
        return result.rowCount;
    } catch (e) {
        throw e;
    }
}


module.exports = {
    insertarParticipante,
    getParticipantes,
    getValidacion,
    actualizarParticipante,
    setParticipanteStatus,
    deleteParticipante
}