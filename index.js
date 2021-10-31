const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const { insertarParticipante, getParticipantes, getValidacion, actualizarParticipante, deleteParticipante } = require('./consultas');
const secretKey = "secret";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/assets", express.static(__dirname + "/assets"));
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
    console.log(email);
    console.log(password);
    try {
        let user = await getValidacion( email, password );
        if(user){
            //console.log(user);




            
            res.render("Datos", { layout: "datos"});
        }else{
            res.send("<h1> Datos incorrectos ...</h1>")
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
        //console.log(target_file);
        const { nombre, email, password, anos_experiencia, especialidad} = req.body;
        //Paso para guardar la imagen
        target_file.mv(`${__dirname}/assets/imgs/${target_file.name}`, (err) => {    //se puede manejar try catch para la subiuda del archivo
            //res.send("Archivo cargado con éxito");
        });
        const participante = [email,nombre,password,anos_experiencia,especialidad,target_file.name,false]
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



app.get( "/datos", function (req, res){
    res.render("Datos", { layout: "datos"});
})


app.get( "/admin", function (req, res){
    res.render("Admin", { layout: "admin"});
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



