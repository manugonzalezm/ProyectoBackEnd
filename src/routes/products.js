import express from 'express';
import fs from 'fs';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

export class ProductManager {
    constructor(pathParam) {
        this.products = []
        this.cantidad = 0
        this.path = pathParam
    }

    cargarProductos() {
        try {
            const fileData = fs.readFileSync(this.path, 'utf8')

            this.products = JSON.parse(fileData)
            this.cantidad = this.products.length + 1
        } catch (error) {
            this.products = []
        }}

    guardarProductos() {
        fs.writeFileSync( this.path, JSON.stringify(this.products), 'utf8' )
    }

    addProduct(product) {
        if(!product.code || !product.title || !product.description || !product.price || !product.thumbnail || !product.stock){
            console.log("El producto ingresado debe contar con todas las propiedades");
            return
        }

        let repetido = false
        if(this.products.find(prod => prod.code==product.code)!==undefined){
            repetido = true
            console.log("Producto repetido")
            return
        }

        if(!repetido){
            this.products.push({...product, id: this.cantidad})
            this.cantidad++
            this.guardarProductos()
        }
    }

    getProducts() {
        this.cargarProductos()
        return(this.products)
    }

    getProductById(id) {
        this.cargarProductos()
        const buscado = this.products.find(prod => prod.id==id)

        if(buscado!==undefined){
            return buscado
        } else{
            console.log("Not found")
        }
    }

    updateProduct(id, fields) {
        const i = this.products.findIndex(p => p.id === id)
        if(i !== -1){
            this.products[i] = { ...this.products[i], ...fields }
            this.guardarProductos()
        } else{
            console.log("No se encontró el producto")
        }
    }

    deleteProduct(id) {
        const i = this.products.findIndex(p => p.id === id)
        if(i !== -1){
            this.products = this.products.map(p => p.id!==i)
            this.guardarProductos()
        } else{
            console.log("No se encontró el producto")
        }
    }
}

const instanceManager = new ProductManager("./productos.json");

router.get('/', (req,res)=>{
    const limit = req.query.limit ? req.query.limit : false;
    if(limit){
        res.send(instanceManager.getProducts().slice(0, limit));
    } else{
        res.send(instanceManager.getProducts());
    }
})

router.get('/:pid', (req,res)=>{
    const id = req.params.pid;
    res.send(instanceManager.getProductById(id));
})

router.post('/' ,(req,res)=>{
    let prod = req.body;

    if(!prod.title || !prod.description || !prod.code || !prod.price || !prod.status || !prod.stock || !prod.category ){
        return res.status(400).send({status:"error",error:"Campos incompletos"});
    } else if(prod.title && prod.description && prod.code && prod.price && prod.status && prod.stock && prod.category){
        instanceManager.addProduct({
            title: prod.title,
            description: prod.description,
            code: prod.code,
            price: prod.price,
            status: prod.status,
            stock: prod.stock,
            category: prod.category,
            thumbnails: prod.thumbnails ? prod.thumbnails : [],
        })
    } 

    res.send({status:"success",message:"Producto agregado"});
    // res.status(201).json({ status: 200, message: "Producto agregado" });
})

router.put('/:pid', (req,res)=>{
    let pid = req.params.pid;
    instanceManager.updateProduct(pid, req.body);
    res.send({status:"sucess",message:"Producto actualizado"});
})

router.delete('/:pid', (req,res)=>{
    let pid = req.params.pid;
    instanceManager.deleteProduct(pid);
    res.send({status:"sucess",message:"Producto eliminado"});
})

export { router as productsRouter };