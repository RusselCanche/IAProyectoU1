document.addEventListener("DOMContentLoaded",function(){
    crearCuadricula();
})

function crearCuadricula(){
    let cuadricula = document.querySelector("#cuadricula")
    let htmlContent=""
    for(let i=0;i<25;i++){
        htmlContent+="<tr>"
        for(let j=0;j<25;j++){
            htmlContent += "<td></td>"
        }
        htmlContent+="</tr>";
    }
    cuadricula.innerHTML = htmlContent;
}

