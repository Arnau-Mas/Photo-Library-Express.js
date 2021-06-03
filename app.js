const imatges = [{ //creem l'array d'objectes que despres ensenyarem en pantalla
    id: 1,
    titol: "Panda",
    url: "https://static.scientificamerican.com/espanol/cache/file/050D641B-C40F-460A-B892534B0024CB3C_source.jpg",
    data: "2021-06-02",
    color: [ 46, 55, 47 ]
},{
    id:2,
    titol: "Oso",
    url: "https://verdeyazul.diarioinformacion.com/wp-content/uploads/2020/07/portada-article-img-20-1024x683.jpg",
    data:"2021-05-24",
    color: [ 54, 63, 57 ]
}
]
const express = require("express"); //requerim el modul express per tenir acces a les funcions d'express
const app = express(); //emmagatzemem el modul en una variable
const { getColorFromURL } = require('color-thief-node'); //per pillar el color predominant de cada imatge

//ejs ens permet afegir javascript de manera dinamica
app.set("view engine", "ejs"); //per poder fer us dels arxius ejs com index.ejs, etc (PERQUÈ FUNCIONI AIXÒ S'HA DINSTALAR ejs amb npm i ejs)

app.use(express.static('public')); //per q l'app tingui acces a la carpeta public, per tant anira alla automaticament a buscar arxius css i coses per les quals no fa falta posar /public/arxiu, hauriem de posar les subcarpetes si n'hi haguessin dins de public, /css/style.css
app.use(express.urlencoded({ extended: false })); //per poder tenir acces a les dades del post

app.get("/", (req,res)=>{
    res.status(200).render("index.ejs",{
        pagina:"",
    });//tambe es pot posar index sense ejs, perque el render es per la carpeta views, i alla nomes hi ha ejs. Motiu pel qual tampoc fa falta posar el nom de la carpeta
})

app.get("/afegir", (req,res)=>{
    res.status(200).render("afegir.ejs", {
        error:false,
        pagina:"afegir",
    });
})

app.post("/afegir", async (req,res)=>{ //hem posat async aqui per poder utilitzar dominantColor await, q quan hi ha awat s'ha de fer una funcio asincrona
    const titol = req.body.titol; 
    const url = req.body.url; 
    const data = req.body.data;
    const urlTrobada = imatges.find(imatgeBuscada => imatgeBuscada.url == url); 
    console.log("El titol es: ",titol);
    console.log("La url es: ",url);
    console.log("La data es: ",data);

    const dominantColor = await getColorFromURL(url);
    console.log("El color dominant es: ",dominantColor);

    if(!urlTrobada){
    imatges.push({
        id: imatges.length+1,
        titol:titol,
        url:url,
        data:data,
        color:dominantColor
    })
    console.log(imatges);
    res.redirect("/imatges");
    }else{
        res.status(200).render("afegir",{
            error: true,
        })    
    }
})

app.get("/imatges", (req,res)=>{
    
    res.status(200).render("imatges.ejs", {
        totesLesImatges:imatges,
        totalImatges:imatges.length,
        pagina:"imatges",
    });
})

app.get("/imatges/:idImatge", (req,res)=>{
    let idImatge =  req.params.idImatge;
    const imatgeTrobada = imatges.find(imatgeBuscada => imatgeBuscada.id == idImatge);
    console.log(imatgeTrobada)
    if(imatgeTrobada){
        res.status(200).render("imatgeid", { 
            idImatge:idImatge,       
            imatgeTrobada: imatgeTrobada,
            pagina:"imatges",
        })
    }else{
        res.status(404).send("<h1>No se ha encontrado la imagen</h1>");
    }

})

app.use((req, res)=>{ //alternativa a app.get("*") més professional, per quan s'accedeix a qualsevol altre endpoint i altres coses q no hagin estat definides
    res.status(404).send("<h1>Error 404: Aquesta pàgina no existeix</h1>");
})

app.listen(3000);