const listaCarrito = document.getElementById('lista-carrito')

document.addEventListener('DOMContentLoaded', () => {
    const carritoGuardado = localStorage.getItem('carrito')
    if(listaCarrito !== null){
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado)
            actualizarCarrito()

            listaCarrito.addEventListener('click', (event) => {
            if (event.target.classList.contains('img-eliminar')) {
                const idProducto = parseInt(event.target.parentNode.value)
                eliminarDelCarrito(idProducto)
            }
        })
        }else{
            mostrarErrorCarrito()
        }
    }

})

