import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import {Map, Marker, TileLayer} from 'react-leaflet'
import {LeafletMouseEvent} from 'leaflet'
import axios from 'axios'
import { useHistory }from 'react-router-dom'
// Components
import api from '../../services/api'
// CSS
import './CreatePoint.scss'

const CreatePoint = () => {

    interface Item {
        id: number,
        title: string,
        image_url: string,
    }

    interface Uf {
        sigla: string
    }

    interface City {
        nome : string
    }

    const [items, setItems] = useState<Item[]>([])
    const [fetchedData, setFetchedData] = useState<Uf[]>([])
    const [uf, setUf] = useState('UF')
    const [cities, setCities] = useState<City[]>([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
    })
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedItem, setSelectedItem] = useState<number[]>([])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]) 

    const history = useHistory()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords
            console.log(position)
            setInitialPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items').then((response) => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await axios({
            method: 'GET',
            url : 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?OrderBy=nome'
          }).then((result) => {
            setFetchedData(result.data)
          })
          .catch((err) => console.log(err.error))
        }
        
        fetchData()

    }, [])

    useEffect(() => {

        if (uf === 'UF') return

        const fetchData = async () => {
            await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then((response) => {
                setCities(response.data)
            })
        }

        fetchData()
    }, [uf])

    const renderItems = () => {
        return (
            items.map((item) => (
                <li key={item.id} 
                onClick={() => handleSelectItem(item.id)} 
                className={selectedItem.includes(item.id) ? 'selected' : ''}
                >
                    <img src={item.image_url} alt={item.title} />
                    <p> {item.title} </p>
                </li>
            ))
        )
    }

    const renderStates = () => {
        return (
            fetchedData.map((item) => (
            <option value={item.sigla} key={item.sigla}> {item.sigla} </option>
            ))
        )
    }

    const renderCities = () => {
        return (
            cities.map((city, index) => (
            <option value={city.nome} key={index}> {city.nome}</option>
            ))
        )
    }

    const handleState = (event: ChangeEvent<HTMLSelectElement>) => {
        setUf(event.target.value)
    }

    const handleCity = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(event.target.value)
    }

    const handleMapClick = (event: LeafletMouseEvent) => {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {

        const {name, value} = event.target

        setFormData({...formData, [name] : value})
    }

    const handleSelectItem = (id: number) => {

        const alreadySelected = selectedItem.findIndex(item => item === id)

        if (alreadySelected >=0 ){
            const filteredItems = selectedItem.filter(item => item !== id)
            setSelectedItem(filteredItems)
        }else {
            setSelectedItem([...selectedItem, id])
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()  

        const { name, email, whatsapp} = formData
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItem
        const data = {
            name, 
            email, 
            whatsapp, 
            uf,
            city, 
            longitude, 
            latitude, 
            items
        }

        await api.post('/points', data)

        alert('ponto de coleta criado')

        history.push('/')
    }

    return (
    <div className="cadastro">
        {console.log('Render do CreatePoint')}
        <div className="container">
            <h1> Cadastro do ponto de coleta </h1>
            <div className="form_box">
                <h2> Dados da entidade </h2>
                <form className="formulario" onSubmit={handleSubmit}>
                    <div className="input_box">
                        <label htmlFor="nome"> Nome da entidade </label>
                        <input type="text" id="nome" name="name" onChange={handleInputChange}/>
                    </div>
                    <div className="two_boxes">
                        <div className="input_box email">
                            <label htmlFor="email"> Email </label>
                            <input type="text" id="email" name="email" onChange={handleInputChange}/>
                        </div>
                        <div className="input_box whatsapp">
                            <label htmlFor="whatsapp"> WhatsApp </label>
                            <input type="text" id="whatsapp" name="whatsapp" onChange={handleInputChange}/>
                        </div>
                    </div>
                    <Map center={initialPosition} zoom={15} className="mapa" onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <Marker position={selectedPosition} />
                    </Map> 
                    <div className="two_boxes">
                        <div className="input_box cidade">
                            <label htmlFor="cidade"> Cidade </label>
                            <select id="cidade" onChange={(event): void => handleCity(event)} value={selectedCity}>
                                <option value="0"> Selecione a cidade </option>
                                {renderCities()}
                            </select>
                        </div>
                        <div className="input_box estado">
                            <label htmlFor="estado"> Estado </label>
                            <select id="estado" onChange={(event): void => handleState(event)} value={uf}>
                                <option value="UF"> Selecione o estado </option>
                                {renderStates()}
                            </select>
                        </div>
                    </div>
                    <div className="items">
                        <div className="title_box_itens">
                            <h2> Itens de coleta </h2>
                            <p> Selecione um ou mais itens abaixo</p>
                        </div>
                        <ul>
                        {renderItems()}
                        </ul>                           
                    </div>
                    <div className="last_button">
                        <button> Cadastro do ponto de coleta</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default CreatePoint