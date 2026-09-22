# Asteroids

Clon del clásico arcade **Asteroids** implementado en canvas HTML5 puro, sin dependencias ni bundler.

## Descripción

Nave espacial en un campo de asteroides con envolvimiento de bordes (el espacio es toroidal). Destruye asteroides para sumar puntos: los grandes se parten en medianos, los medianos en pequeños. Incluye power-ups especiales y tipos de asteroides únicos como la estrella fugaz.

## Tecnologías

- **HTML5 Canvas** — renderizado 2D
- **JavaScript (ES6+)** — lógica del juego en un solo archivo `game.js`
- Sin frameworks, sin bundler, sin dependencias

## Cómo correr

Abre `index.html` directamente en el navegador (doble clic), o usa un servidor local:

```bash
npx serve .
```

Luego visita `http://localhost:3000`.

## Controles

| Tecla     | Acción     |
| --------- | ---------- |
| `←` `→`   | Rotar nave |
| `↑`       | Propulsar  |
| `Espacio` | Disparar   |
| `C`       | Cambiar skin de la nave |

## Puntuación

| Asteroide      | Puntos |
| -------------- | ------ |
| Grande         | 20     |
| Mediano        | 50     |
| Pequeño        | 100    |
| Estrella fugaz | 150    |

## Características

- 3 vidas con invencibilidad temporal al reaparecer (parpadeo)
- Asteroides se parten en fragmentos más pequeños al ser destruidos
- Estrella fugaz: asteroide especial, amarillo y con estela, que cruza la pantalla al doble y medio de velocidad y se desvanece a los 6 segundos si no lo destruyes. No se parte y no bloquea el paso de nivel; vale 150 puntos
- Power-up **Velocidad**: aparece de vez en cuando y duplica el empuje de la nave durante 5 segundos
- Skins de la nave: 3 apariencias (forma y color distintas) que se ciclan con `C` y se recuerdan entre sesiones
- Partículas de explosión al destruir asteroides

## Tests

Comprobación end-to-end con Playwright sobre Chrome (el juego en sí no tiene dependencias en tiempo de ejecución, esto es solo para desarrollo):

```bash
npm install
npm test
```
