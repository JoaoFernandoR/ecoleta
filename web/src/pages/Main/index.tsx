import React from 'react'
import './Main.scss'

const Main = () => {
    return (
    <div className="main">
      {console.log('Render do Main')}
        <div className="title">
            <h1> Seu MarketPlace de coleta de resíduos </h1>
            <p className="p"> Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>
            <div className="title_box">
                <div className="button_box">
                    <div className="button"></div>
                </div>
                <p> Pesquisar pontos de coleta </p>
            </div>
        </div>
    </div>
    )
}

export default Main