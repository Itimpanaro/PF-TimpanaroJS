function cambiarBotonSinStock(){
    productos.forEach((producto, index) => {
        if (producto.stock === 0) {
            btnStock.forEach(boton => {
                if (boton.getAttribute("value") == producto.id) {
                    boton.innerHTML = '<span class="no-stock">Sin stock</span>'
                }
            })
        }
    })
}

function agregarAlCarrito(id){
    const productoEncontrado = productos.findIndex((Element) => Element.id == id)
    if(productoEncontrado !== -1 && productos[productoEncontrado].rating.count > 0){
        productos[productoEncontrado].rating.count --
        const iCarrito = carrito.findIndex(item => item.id == id)
        if(iCarrito !== -1){
            carrito[iCarrito].cantidad++
        }else{
            const nuevoProducto = {...productos[productoEncontrado], cantidad: 1}
            carrito.push(nuevoProducto)
        }
        acumuladorCarrito()
        localStorage.setItem('productos', JSON.stringify(productos))
        localStorage.setItem('carrito', JSON.stringify(carrito))
        mostrarMensajeAgregadoAlCarrito()
    }
    cambiarBotonSinStock()
}

function acumuladorCarrito(){
    let totalProductos = 0
    carrito.forEach(item => {
        totalProductos += item.cantidad
    })
    contadorCarrito.innerText = totalProductos
}

let mensajeVisible = false
function mostrarMensajeAgregadoAlCarrito(){
    if(!mensajeVisible){
        Toastify({
            text: "Producto añadido al carrito",
            duration: 1000,
            position: "center",
            gravity: "bottom",
            style:{
                background: "#000000",
            },
        }).showToast()

        mensajeVisible = true
        setTimeout(()=>{
            mensajeVisible = false
        }, 1000)
    }
}

let pagoTotal = 0
function actualizarCarrito() {
    listaCarrito.innerHTML = ''
    let totalAPagar = 0
    
    if (carrito.length > 0) {
        carrito.forEach(item => {
            const precioUnidad = item.price
            const cantidadProducto = item.cantidad
            let totalPorProducto = precioUnidad * cantidadProducto
            const productoLista = document.createElement('article')
            
            productoLista.classList.add('art-carrito')
            productoLista.innerHTML = `
            <img class="muestra-carrito" src="${item.image}" alt="${item.description}">
            <span class="descripcion-carrito">${item.title}</span>
            <span class="descripcion-carrito text-center">Precio<br>$${(totalPorProducto).toFixed(2)}</span>
            <span class="descripcion-carrito text-center">Cantidad<br>${item.cantidad} Un.</span>
            <button class="btn-eliminar" value=${item.id}><img class="img-eliminar" src="./imagenes/eliminar.png" alt="Eliminar"></button>
            `
            listaCarrito.appendChild(productoLista)
            
            const subtotal = item.price * item.cantidad
            totalAPagar += subtotal
            pagoTotal = totalAPagar
        })

        const codigoDescuento = document.createElement('div')
        codigoDescuento.classList.add('text-center', 'pt-3')
        codigoDescuento.innerHTML = `<span>Codigo de descuento: </span>
        <input class="codigo-ingresado" type="text" placeholder="CODIGO">
        <button class="btn-codigo">Enviar</button>
        <div class="msg-codigo p-0"></div>`
        listaCarrito.appendChild(codigoDescuento)
        const totalAPagarDiv = document.createElement('div')
        totalAPagarDiv.classList.add('p-3', 'text-center')
        totalAPagarDiv.innerHTML = `<span class="total-precio">Subtotal: $${(totalAPagar).toFixed(2)}</span>
        <br>
        <span class="precio-descuento"></span>
        <br>
        <button class="pagar">Pagar</button>`
        listaCarrito.appendChild(totalAPagarDiv)
        validarCodigo(totalAPagar)
        
        const btnPagar = document.querySelector('.pagar')
        const contenedor = document.querySelector('#pagos')
        btnPagar.addEventListener('click', ()=>{
            document.body.classList.remove('desplazar-auto')
            document.body.classList.add('desplazar-block')
            document.documentElement.scrollTop = 0
            contenedor.classList.remove('d-none')
            const nuevoDiv = document.createElement('div')
            nuevoDiv.classList.add('fondo-pago')
            nuevoDiv.innerHTML = `
            <div class="ventana-pago">
                <button class="cerrar-pago">X</button>
                <section id="cuotas">

                    <table class="tabla-pago">
                        <tr>
                            <td>Cuotas</td>
                            <td>Precio por cuota</td>
                            <td>Precio total</td>
                        </tr>
                        <tr>
                            <td>1 cuota</td>
                            <td>$${(pagoTotal).toFixed(2)}</td>
                            <td>$${(pagoTotal).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>3 cuotas</td>
                            <td>$${parseFloat(((pagoTotal*1.30) / 3).toFixed(2))}</td>
                            <td>$${parseFloat((pagoTotal*1.30).toFixed(2))}</td>
                        </tr>
                        <tr>
                            <td>6 cuotas</td>
                            <td>$${parseFloat(((pagoTotal*1.65) / 6).toFixed(2))}</td>
                            <td>$${parseFloat((pagoTotal*1.65).toFixed(2))}</td>
                        </tr>
                        <tr>
                            <td>12 cuotas</td>
                            <td>$${parseFloat(((pagoTotal*2) / 12).toFixed(2))}</td>
                            <td>$${parseFloat((pagoTotal*2).toFixed(2))}</td>
                        </tr>
                    </table>

                    <label for="cuotas">Cantidad de cuotas:</label>
                    <select id="cuotas" class="mt-5">
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="12">12</option>
                    </select>
                    <br>
                    <button class="siguiente">Siguiente</button>
                </section>
                <div class ="pasos">
                    <div class="indice-guia">
                        <span>1. Cuotas</span>
                        <span>2. Datos</span>
                        <span>3. Pago</span>
                        <span>4. Confirmacion</span>
                        <span class="barra actual"></span>
                        <span class="barra desactivado"></span>
                        <span class="barra desactivado"></span>
                        <span class="barra desactivado">4.confirmacion</span>
                    </div>
                </div>`
            contenedor.appendChild(nuevoDiv)

            const siguiente = document.querySelector('.siguiente')
            siguiente.addEventListener('click', ()=>{
                nuevoDiv.innerHTML = ''
                nuevoDiv.innerHTML= `<div class="ventana-pago">
                <button class="cerrar-pago">X</button>
                <fieldset>
                    <legend>Datos Personales:</legend>
                    <label for="fname">Nombre:</label>
                    <input type="text" id="fname" name="fname"><br><br>
                    <label for="dni">dni:</label>
                    <input type="number" id="dni" name="dni"><br><br>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email"><br><br>
                    <label for="birthday">Fecha de nacimiento:</label>
                    <input type="date" id="birthday" name="birthday"><br><br>
                </fieldset>
                <br>
                <button class="siguiente">Siguiente</button>
                <div class ="pasos">
                    <div class="indice-guia">
                        <span>1. Cuotas</span>
                        <span>2. Datos</span>
                        <span>3. Pago</span>
                        <span>4. Confirmacion</span>
                        <span class="barra completo"></span>
                        <span class="barra actual"></span>
                        <span class="barra desactivado"></span>
                        <span class="barra desactivado">4.confirmacion</span>
                    </div>
                </div>`
                contenedor.appendChild(nuevoDiv)
                
                const btnCerrar = document.querySelector('.cerrar-pago')
                btnCerrar.addEventListener('click', ()=>{
                    document.body.classList.remove('desplazar-block')
                    document.body.classList.add('desplazar-auto')
                    contenedor.removeChild(nuevoDiv)
                    contenedor.classList.add('d-none')
                    
                })
                const siguiente = document.querySelector('.siguiente')
                siguiente.addEventListener('click', ()=>{
                    nuevoDiv.innerHTML = ''
                    nuevoDiv.innerHTML= `<div class="ventana-pago">
                    <button class="cerrar-pago">X</button>
                    <fieldset>
                        <legend>Datos Personales:</legend>
                        <label for="cardnum">Nombre:</label>
                        <input type="number" id="cardnum" name="cardnum"><br><br>
                        <label for="vence">Vencimiento:</label>
                        <input type="month" id="vence" name="vence"><br><br>
                        <label for="CVV">CVV</label>
                        <input type="tel" maxlength="3" id="CVV" name="CVV"><br><br>
                    </fieldset>
                    <br>
                    <button class="siguiente">Siguiente</button>
                    <div class ="pasos">
                        <div class="indice-guia">
                            <span>1. Cuotas</span>
                            <span>2. Datos</span>
                            <span>3. Pago</span>
                            <span>4. Confirmacion</span>
                            <span class="barra completo"></span>
                            <span class="barra completo"></span>
                            <span class="barra actual"></span>
                            <span class="barra desactivado">4.confirmacion</span>
                        </div>
                    </div>`
                    contenedor.appendChild(nuevoDiv)
                    
                    const btnCerrar = document.querySelector('.cerrar-pago')
                    btnCerrar.addEventListener('click', ()=>{
                        document.body.classList.remove('desplazar-block')
                        document.body.classList.add('desplazar-auto')
                        contenedor.removeChild(nuevoDiv)
                        contenedor.classList.add('d-none')
                        
                    })
                })
            })

            const btnCerrar = document.querySelector('.cerrar-pago')
            cerrar = btnCerrar.addEventListener('click', ()=>{
                document.body.classList.remove('desplazar-block')
                document.body.classList.add('desplazar-auto')
                contenedor.removeChild(nuevoDiv)
                contenedor.classList.add('d-none')
            })
        })
        
    }else{
        mostrarErrorCarrito()
    }   
}

function mostrarErrorCarrito(){
        const nuevoItem = document.createElement('article')
        nuevoItem.classList.add('no-stock', 'p-5', 'h1', 'text-center')
        nuevoItem.innerHTML = `<img class="apagado text-center" src="./imagenes/carrito.png"></img>
        <br><br><span class="text-center">NO EXISTEN PRODUCTOS EN EL CARRITO</span><br><br>
        <a class="nav-link" href="./index.html"><button class="agregarAlCarrito t-0">Ir a la tienda</button></a>`
        listaCarrito.appendChild(nuevoItem)
}

function eliminarDelCarrito(id) {
    const indiceProductoOriginal = carrito.findIndex(item => item.id === id)
    if (indiceProductoOriginal !== -1) {
        if (carrito[indiceProductoOriginal].cantidad > 1) {
            carrito[indiceProductoOriginal].cantidad--
        } else {
            carrito.splice(indiceProductoOriginal, 1)
        }
        const indiceProducto = productos.findIndex(item => item.id === id)
        productos[indiceProducto].stock++
        acumuladorCarrito()
        localStorage.setItem('productos', JSON.stringify(productos))
        localStorage.setItem('carrito', JSON.stringify(carrito))
        actualizarCarrito()
        if(!mensajeVisible){
            Toastify({
                text: "Producto eliminado del carrito",
                duration: 1000,
                position: "center",
                gravity: "bottom",
                style:{
                    background: "#000000",
                },
            }).showToast()
    
            mensajeVisible = true
            setTimeout(()=>{
                mensajeVisible = false
            }, 1000)
        }
    }
}

function crearCodigo(){
    const newsDiv = document.querySelector('.codigo-descuento')
    const nuevoMensaje = document.createElement('div')
    nuevoMensaje.classList.add('newsletter-texto')
    nuevoMensaje.innerHTML = `TU CODIGO ES: NIKE10OFF`
    newsDiv.appendChild(nuevoMensaje)

}

function validarCodigo(precio){
    if(localStorage.getItem('email') !== null){
        let banderaDescuento = 0
        let mensajeMostrado = false
        const div = document.querySelector('.msg-codigo')
        const span = document.querySelector('.precio-descuento')
        const emailOriginal = localStorage.getItem('email')
        const btnCodigo = document.querySelector('.btn-codigo')
        const codigoIngresado = document.querySelector('.codigo-ingresado')
        const codigoOff = 'NIKE10OFF'
        btnCodigo.addEventListener('click', () => {
            const codigoValue = codigoIngresado.value.toUpperCase()
            if(codigoValue === codigoOff && mensajeMostrado === false){
                const msgExito = document.createElement('span')
                msgExito.classList.add('text-center', 'total-precio')
                msgExito.innerHTML = `<span class="correcto">Codigo Correcto</span>`
                div.appendChild(msgExito)
                setTimeout(() => {
                    div.removeChild(msgExito)
                }, 1000)
                setTimeout(()=>{
                    if(banderaDescuento === 0){
                        const msgDescuento = document.createElement('span')
                        msgDescuento.classList.add('text-center', 'total-precio', 'pt-2', 'validar-descuento')
                        msgDescuento.innerHTML = `Precio con descuento: $${parseFloat((precio * 0.90).toFixed(2))}`
                        span.appendChild(msgDescuento)
                        banderaDescuento++
                        pagoTotal = parseFloat((precio * 0.90).toFixed(2))
                        mensajeMostrado = false
                    }
                },1000)
                mensajeMostrado = true
            }
            else{
                if(!mensajeMostrado){
                    const msgError = document.createElement('span')
                    msgError.classList.add('text-center', 'total-precio')
                    msgError.innerHTML = `<span class="error">Codigo Incorrecto</span>`
                    div.appendChild(msgError)
                    setTimeout(()=>{
                        div.removeChild(msgError)
                        mensajeMostrado = false
                    }, 1000)
                    mensajeMostrado = true
                }
            }
        })
    }
}

