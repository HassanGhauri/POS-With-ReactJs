import {useEffect,useState, useRef} from 'react'
import axios from 'axios'
import MainLayout from '../layouts/MainLayout'
import { toast } from 'react-toastify'
import { ComponentToPrint } from '../Components/ComponentToPrint'
import { useReactToPrint } from 'react-to-print';
const baseURL = "http://localhost:5000"
const POSPage = () => {
    const [products,setProducts] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [cart,setCart] = useState([])
    const [totalAmount,setTotalAmount] = useState(0);

    const toastOptions = {
        autoClose: 400,
        pauseOnHover:true
    }

    const componentref = useRef();

    const handleReactToPrint = useReactToPrint({
        content: () => componentref.current,
    });

    const fetchProducts = async()=>{
        setIsLoading(true)
        const data = await axios.get(`${baseURL}/products`)
        setProducts(await data.data)
        setIsLoading(false)
        // const product_list = data.data
        // setProducts(product_list)
        // console.log(data.data)
        // console.log(product_list)

    }

    const addProductToCart = async(product)=>{
        let findProductInCart = await cart.find(i =>{
            return i.id === product.id
        });

        if(findProductInCart){
            let newCart = [];
            let newItem;
            cart.forEach(cartItem =>{
                if(cartItem.id === product.id){
                    newItem = {
                        ...cartItem,
                        quantity:cartItem.quantity +1,
                        totalAmount: cartItem.price * (cartItem.quantity)
                    }
                    newCart.push(newItem)
                }else{
                    newCart.push(cartItem)
                }
            });
            setCart(newCart);
            toast(`Added ${newItem.name} to cart`)
        } else {
            let addingProduct = {
                ...product,
                "quantity":1,
                "totalAmount":product.price
            }
            setCart([...cart,addingProduct]);
            toast(`Added ${product.name} to cart`,toastOptions)
        }
        
    }
    const removeProduct = async(product)=>{
        const newCart = cart.filter(cartItem => cartItem.id !== product.id);
        setCart(newCart)
    }
    const handlePrint = ()=>{
        handleReactToPrint();
    }

    useEffect(()=>{
        fetchProducts()
    },[])

    useEffect(()=>{
        let newTotalAmount = 0;
        cart.forEach(icart => {
            newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
        })
        setTotalAmount(newTotalAmount)
    },[cart])



  return (
    <MainLayout>
        <div className="row">
            <div className="col-lg-8">
                {isLoading ? 'Loading' : <div className='row'>
                    {products && products.map((product,key)=>{
                        return(
                            <div key={key} className='col-lg-4 mb-4'>
                                <div className="pos-item px-3 text-center border" onClick={()=>addProductToCart(product)}>
                                    <p>{product.name}</p>
                                    <img src={product.image} alt={product.name} className='img-fluid'/>
                                    <p>${product.price}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>
            <div className="col-lg-4">
                <div style={{display:"none"}}>
                    <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentref}/>
                </div>
                <div className='table-responsive bg-dark'>
                    <table className='table table-responsive table-dark table-hover'>
                        <thead>
                            <tr>
                                <td>#</td>
                                <td>name</td>
                                <td>Price</td>
                                <td>Qty</td>
                                <td>Total</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {cart ? cart.map((cartProduct,key)=> <tr key={key}>
                                <td>{cartProduct.id}</td>
                                <td>{cartProduct.name}</td>
                                <td>{cartProduct.price}</td>
                                <td>{cartProduct.quantity}</td>
                                <td>{cartProduct.totalAmount}</td>
                                <td>
                                    <button className='btn btn-danger btn-small' onClick={()=>removeProduct(cartProduct)}>Remove</button>
                                </td>
                            </tr>)
                            : "No item in cart"}
                        </tbody>
                    </table>
                    <h2 className='px-2 text-white'>Total Amount: ${totalAmount}</h2>
                </div>

                <div className="mt-3">
                    { totalAmount !==0 ? <div>
                        <button className='btn btn-primary' onClick={handlePrint}>Pay now</button>
                    </div>: "Please add a product to the cart" }
                </div>
            </div>
        </div>
    </MainLayout>
  )
}

export default POSPage