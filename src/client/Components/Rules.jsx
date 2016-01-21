import React from 'react';

import lang from '../lang.jsx';

export default (props) => {
    return (
        <div>
            <h1>{lang.rules}</h1>
            <p>
                Hay al menos dos jugadores. Un jugador recibe las informaciones en alemán de un lugar en Colombia. 

Tiene que traducir al español e introducir en el campo. Cuando los otros jugadores han recibido las 

informaciones, tienen que mostrar y adivinar el lugar en la mapa. Entre más corta la distancia, más 

puntos se consiguen. El jugador con más puntos ha ganado. Después de una partida, todos cambia los 

roles y un otro jugador tiene que traducir.
                <br />
                <br />
el vocabulario nuevo: <br />

introducir - eingeben <br /> el campo - das Feld <br /> mostrar - zeigen <br /> adivinar - erraten <br /> conseguir - erreichen <br />

cambiar - tauschen
            </p>
            <a onClick={props.goToHello}>{lang.back}</a>
        </div>
    )
}
