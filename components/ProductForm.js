import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import CurrencyInput from 'react-currency-input-field';
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";
import Image from 'next/image';

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [images, setImages] = useState(existingImages || []);
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);
    function cancelAction(ev) {
        ev.preventDefault();
        router.push('/products');
    }
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title,
            description,
            price,
            images,
            properties:productProperties
        };
        if (category) {
            data.category = category;
        }
        if (_id) {
            await axios.put('/api/products', {...data, _id});
        } else {
            axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    async function deleteImage(index) {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Title</label>
            <input
                type="text"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value=""></option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => {
                if (p.name) {
                    return (
                        <div key={p.name} className="">
                            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                            <div>
                                <select
                                    value={productProperties[p.name]}
                                    onChange={ev =>
                                        setProductProp(p.name, ev.target.value)
                                    }>
                                    {p.values.map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )
                }
            })}
            <label>Description</label>
            <textarea
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Images</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
                    {!!images?.length && images.map((link, index) => (
                        <div key={link} className="h-24 relative bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <Image src={link} alt="" className="rounded-lg"/>
                            <button
                                onClick={() => deleteImage(index)}
                                className="absolute right-0 top-0 bg-red-500 text-white w-4 h-4 m-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-primary rounded-sm bg-white shadow-sm border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Add image</div>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
            </div>
            <label>Price</label>
            <CurrencyInput
                placeholder="0.00"
                value={price}
                prefix="$"
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={value => setPrice(value)}
            />
            <div className="flex gap-1">
                <button
                    onClick={cancelAction}
                    className="btn-default">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary">
                    Save
                </button>
            </div>
        </form>
    );
}