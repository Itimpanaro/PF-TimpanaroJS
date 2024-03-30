let carrito = []
let subsNews = []
const btnStock = document.querySelectorAll('.btn-stock')
const btnCarrito = document.querySelector('.carrito-btn')
const msgAgregado = document.querySelectorAll('.msgAgregado')
const alertaNews = document.querySelector('#newsletter')
const cerrarAlertNews = document.querySelector('.newsletter-close')
const inputEmail = document.querySelector('.newsletter-input')
const emailNews = document.querySelector('.newsletter-submit')
let botones = document.querySelectorAll('.agregarAlCarrito')
let contadorCarrito = document.querySelector('.contador')

btnCarrito.addEventListener('click', function(){
    window.location.href = "carrito.html"
})

document.addEventListener('DOMContentLoaded', () => {
    if(alertaNews !== null){
        const emailGuardado = localStorage.getItem('email')
        if (emailGuardado !== null) {
            alertaNews.style.display = 'none'
        } else {
            alertaNews.style.display = 'block'
            cerrarAlertNews.addEventListener('click', () => {
                alertaNews.style.display = 'none'
            })
            emailNews.addEventListener('click', (event) => {
                const email = inputEmail.value
                subsNews.push(email)
                localStorage.setItem('email', JSON.stringify(subsNews))
                crearCodigo()
            })
        }
    }    

    const productosGuardados = localStorage.getItem('productos')
    if(productosGuardados){
        productos = JSON.parse(productosGuardados)
    }
    cambiarBotonSinStock()
    const carritoGuardado = localStorage.getItem('carrito')
    if(carritoGuardado){
        carrito = JSON.parse(carritoGuardado)
        acumuladorCarrito()
    }
    
    let emailsGuardados = localStorage.getItem('email')
    if(emailsGuardados){
        emailsGuardados = JSON.parse(emailsGuardados)
    }
})