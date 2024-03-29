const API_BASE = "https://fakestoreapi.com/"
const ENDPOINT_PRODUCTS = 'products'
let productos = []

fetch(API_BASE + ENDPOINT_PRODUCTS)
    .then((respuesta)=>{
        return respuesta.json()
    })
    .then((data)=>{
        productos = data
        const productosSection = document.querySelector('#productos')
        if(productosSection !== null){
            productos.forEach(producto => {
                const productosArticle = document.createElement('article')
                productosArticle.classList.add('productos__article')
                productosArticle.innerHTML = `
                    <a class="img-contenedor" href="#"><img class="img-producto" src="${producto.image}"></a>
                    <p class="fw-bold">${producto.title}</p>
                    <p>$${producto.price}</p> 
                    <div class="btn-stock" value="${producto.id}"> 
                        <button class="agregarAlCarrito" value="${producto.id}">Comprar</button> 
                    </div> 
                    <div class="contenedorMsgAgregado"> 
                        <span class="msgAgregado"></span> 
                    </div>`
                productosSection.appendChild(productosArticle)

                const boton = productosArticle.querySelector('.agregarAlCarrito')
                boton.addEventListener('click', (event) => {
                    const idProducto = event.target.value
                    agregarAlCarrito(idProducto)
                })
            })
        }
    })
    .catch((error)=>{
        console.log(error)
    })


