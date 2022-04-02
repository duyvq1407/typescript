import { Image } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CategoryType } from '../../types/category'
type ProductAddProps = {
  onAdd:(product: TypeInputs) => void
  categories: CategoryType[]
}
type TypeInputs = {
    name: string,
    price:  number,
    image: string,
    category: string
}

const ProductAdd = (props: ProductAddProps) => {
    const {register, handleSubmit, formState: {errors} } = useForm<TypeInputs>();
    const navigate = useNavigate();
    const CLOUDINARY_API = "https://api.cloudinary.com/v1_1/duyvqph18088/image/upload";
    const CLOUDINARY_PRESET = "y12jh0jj";
    const [image, setImage] = useState<String>('https://www.nguonduphong.com/wp-content/themes/hongtq_dev/img/no-image.jpeg')
    const imgPost = document.querySelector("#image");
    imgPost?.addEventListener('change', (e) => {
      setImage(URL.createObjectURL(e.target?.files[0]))
    })
    const onSubmit: SubmitHandler<TypeInputs> = async (data) =>{
      const file = data.image[0]
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      // call api cloudinary
      const response = await axios.post(CLOUDINARY_API, formData, {
          headers: {
              "Content-Type": "application/form-data",
          },
      });
      // console.log({...data, image: response.data.url})
      props.onAdd({...data, image: response.data.url})
      navigate('/admin/products')
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input type="text" {...register('name', {required: true})} className="form-control"/>
          {errors.name && <span style={{color: 'red'}}>This field is required</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Giá sản phẩm</label>
          <input type="number" {...register('price', {required: true})} className="form-control"/>
          {errors.price && <span style={{color: 'red'}}>This field is required</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh sản phẩm</label>
          <input type="file" {...register('image', {required: true})} id="image" className="form-control"/>
          {errors.image && <span style={{color: 'red'}}>This field is required</span>}
          <br />
          {image && <Image src={image} width={200}/>}
        </div>
        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select className="form-select" {...register('category', {required: true})}>
            <option selected disabled value=''>Chọn danh mục</option>
            {props.categories.map(item => {
              return <option value={item._id}>{item.name}</option>
            })}
          </select>
          {errors.category && <span style={{color: 'red'}}>This field is required</span>}
        </div>
        <button className="btn btn-primary">Add Product</button>
      </div>
    </form>
  )
}

export default ProductAdd