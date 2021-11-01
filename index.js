const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const { insertarParticipante, getParticipantes, getValidacion, actualizarParticipante, deleteParticipante } = require('./consultas');
const secretKey = "secret";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/assets", express.static(__dirname + "/assets"));  //imagen debe quedar con el nombre de la persona, con uuid
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
//app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

app.set("view engine" , "hbs");
app.engine(
    "hbs",
    exphbs({
        defaultLayout: "index",
        layoutsDir: __dirname + "/views",
        partialsDir: __dirname + "/views/components/",
        extname: ".hbs"
    })
);


app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit : "El tamaño de la imagen supera el limite permitido",
    })
);


const verifyToken = (req, res, next) => {
    const token =  req.query.token;
    if (!token){
        res.status(401);
        res.send("<h1>No tienes acceso.</h1>");
    } else {
        jwt.verify(token, secretKey, (err, usuario) => {
            if (err) res.send("<h1>No tienes acceso, token incorrecto.</h1>");
            else {
                req.usuario = usuario;
                next();
            }
        });
    }
};


app.get( "/", async (req, res) =>{
    res.render("index");
});

app.get( "/participantes", async (req, res) =>{
    try {
        const respuesta = await getParticipantes();
        res.status(200);
        res.send(JSON.stringify(respuesta));
    }
    catch (e) {
        errorHandler(res, e);
    }
});

app.get( "/login", function (req, res){
    res.render("Login", { layout: "login"});
})


app.post( "/autenticacion" , async (req, res) => {  //Autenticando usuario
    let { email, password } = req.body;
    // console.log(email);
    // console.log(password);
    try {
        let user = await getValidacion( email, password );
        if(user){
            // console.log(user);
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 180,
                    data: user,
                },
                secretKey
            );
            // console.log(token);
            res.json(token); 
        }
    }catch(e){
        console.log(e);
        errorHandler(res, e);
    }
});


app.post("/actualizar", async (req, res) => {
    try {
        const { email, nombre, password, anos_experiencia, especialidad } = req.body;
        const participante = [ email, nombre, password, anos_experiencia, especialidad];
        console.log("en servidor");
        console.log(participante);
        const respuesta = await actualizarParticipante( participante ); 
        res.status(200);
        res.type('json');
        res.send({ data: respuesta });  //FALTA ASOCIAR ROWCOUNT>1 con se realizaron los cambios
    } catch (error) {
        errorHandler(res, error);
    }
});



app.get( "/registro", function (req, res){
    res.render("Registro", { layout: "registro"});
});

app.post("/registro", async (req, res) => {
    try {
        const { target_file } = req.files;
        console.log(target_file);
        const { nombre, email, password, anos_experiencia, especialidad} = req.body;
        //crear nombre de imagen con uuid
        const nombreFoto = `${nombre}-${uuidv4().substring(0,8)}-${target_file.name}`;
        //Paso para guardar la imagen
        target_file.mv(`${__dirname}/assets/imgs/${nombreFoto}`, (err) => {    //se puede manejar try catch para la subiuda del archivo
            //res.send("Archivo cargado con éxito");
        });
        const participante = [email,nombre,password,anos_experiencia,especialidad,nombreFoto,false]
        //console.log(participante);
        const respuesta = await insertarParticipante(participante);
        console.log(respuesta);
        res.status(200);
        res.type('json');
        res.send({ data: respuesta });
    } catch (error) {
        errorHandler(res, error);

    }

});

app.delete("/eliminar/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log("ya en servidor");
        console.log(email);   //hasta acá vamos bien

        const respuesta = await deleteParticipante( email );
        console.log(respuesta);
        res.status(200);
        res.type('json');
        res.send({ data: respuesta });

    } catch (error) {
        errorHandler(res, error);
    }
});



app.get( "/datos", verifyToken, function (req, res){
    const usuario = req.usuario.data;
    res.render("Datos", { layout: "datos", usuario } );
})


app.get( "/admin", verifyToken, async function (req, res){
    try {
        const participantes = await getParticipantes();
        console.log(participantes);
        res.status(200);
        res.render("Admin", { layout: "admin", participantes });
    }
    catch (e) {
        errorHandler(res, e);
    }
})


app.get("*", (req, res) => {
    res.status(404).send("<h1>Pagina no encontrada...</h1>");
});

let errorHandler = (res, error) => {
    console.log(error);
    res.status(500);
    res.send(error);
}


app.listen(3000, ()=> console.log("Servidor encendido => puerto 3000"));



