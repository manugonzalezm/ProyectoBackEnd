import express from 'express';
import fs from 'fs';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

export class CartsManager {
    constructor(pathParam) {
        this.carts = []
        this.cantidad = 0
        this.path = pathParam
    }

    cargarCarritos() {
        try {
            const fileData = fs.readFileSync(this.path, 'utf8')

            this.carts = JSON.parse(fileData)
            this.cantidad = this.carts.length + 1
        } catch (error) {
            this.carts = []
        }}

    guardarCarritos() {
        fs.writeFileSync( this.path, JSON.stringify(this.carts), 'utf8' )
    }

    addCarrito(cart) {
        if(!cart.products){
            console.log("El carrito ingresado debe contar con todas las propiedades");
            return
        }

        if(!repetido){
            this.carts.push({...cart, id: this.cantidad})
            this.cantidad++
            this.guardarCarritos()
        }
    }

    getCarritos() {
        this.cargarCarritos()
        return(this.carts)
    }

    getCarritoById(cid) {
        this.cargarCarritos()
        const buscado = this.carts.find(c => c.id==cid)

        if(buscado!==undefined){
            return buscado.products
        } else{
            console.log("No encontrado")
        }
    }

    updateCarrito(cid, pid) {
        const cartIndex = this.carts.findIndex(c => c.id === cid)
        if(cartIndex !== -1){
            const prodIndex = this.carts[cartIndex].findIndex(p => p.id === pid)
            if(prodIndex !== -1){
                this.carts[i].products[prodIndex] = { ...this.carts[i].products[prodIndex], quantity: this.carts[i].products[prodIndex].quantity++ }
                this.guardarCarritos()
            } else {
                this.carts[i].products[prodIndex] = { ...this.carts[i].products[prodIndex], quantity: 1 }
                this.guardarCarritos()
            }
        } else{
            console.log("No se encontró el carrito")
        }
    }

}

const instanceCarts = new CartsManager("./carrito.json");

router.post('/', (req,res)=>{
    instanceCarts.addCarrito(req.body.products);
    res.send({status:"success",message:"Carrito agregado"});
})

router.get('/:cid', (req,res)=>{
    let cid = req.params.cid;
    if(instanceCarts.getCarritoById(cid)){
        res.send(instanceCarts.getCarritoById(cid).products);
    } else{
        res.send({status:"error",message:"Carrito no encontrado"});
    }
})

router.post('/:cid/product/:pid', (req,res)=>{
    let { cid, pid } = req.params;
    instanceCarts.updateCarrito(cid, pid);

    res.send({status:"success",message:"Carrito actualizado"});
})

export { router as cartsRouter };