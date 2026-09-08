# Aplicación de Ajuste por Mínimos Cuadrados

Esta aplicación permite visualizar y calcular el ajuste de curvas a un conjunto de datos utilizando el **Método de Mínimos Cuadrados**. El proyecto está estructurado con un backend en Python y un frontend interactivo desarrollado con React y Vite.

---

##  ¿En qué se basa el Método de Mínimos Cuadrados?

El **Método de Mínimos Cuadrados** es un procedimiento estándar del análisis numérico para aproximar un conjunto de datos (pares de valores $x$ e $y$) a una función matemática continua (como una recta, una parábola, una curva exponencial, etc.).

Su fundamento teórico consiste en **minimizar la suma de los cuadrados de las diferencias** (conocidas como *residuos* o *errores*) entre los valores reales observados y los valores calculados por la función que propone el modelo.

**En términos simples y prácticos:**
1. Imagina que tienes una serie de puntos dispersos en un gráfico (por ejemplo, mediciones experimentales).
2. Quieres trazar una línea o curva que pase "lo más cerca posible" de todos esos puntos, marcando la tendencia de los datos.
3. El método mide la distancia vertical de cada punto a esa curva. Luego, eleva esa distancia al cuadrado (para que no importen los signos negativos y para darle más peso a los errores grandes).
4. Finalmente, suma todos esos cuadrados. La curva que logre que **esa suma total sea la más pequeña posible (el mínimo)**, es matemáticamente el mejor ajuste para esos datos.

Este método es la base de la regresión lineal (y no lineal) y es fundamental para la predicción, modelado y entendimiento del comportamiento de datos empíricos en ciencias e ingeniería.

---

##  Instrucciones de Instalación y Ejecución

Para ejecutar la aplicación completa en tu computadora, debes levantar tanto el servidor del **Backend** como el del **Frontend** en paralelo (en dos terminales distintas).

### Requisitos previos
- **Python 3.x** instalado.
- **Node.js** y **npm** instalados.

### Paso 1: Configurar y ejecutar el Backend

Abre una terminal y dirígete a la carpeta `backend` de este proyecto:

```bash
cd backend
```

1. **(Opcional pero recomendado)** Crea y activa un entorno virtual para no ensuciar tu instalación global de Python:
   - **En Windows:**
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **En macOS/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

2. **Instala las dependencias** requeridas leyendo el archivo `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecuta el servidor:**
   ```bash
   python main.py
   # (Nota: revisa el nombre del archivo principal de tu backend, puede ser app.py, main.py, etc.)
   ```

### Paso 2: Configurar y ejecutar el Frontend

Abre una **nueva terminal** y navega hasta la carpeta `frontend`:

```bash
cd frontend
```

1. **Instala las librerías** y dependencias del frontend:
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo** de Vite:
   ```bash
   npm run dev
   ```

La terminal te mostrará un enlace local (usualmente `http://localhost:5173/`). Haz clic o cópialo en tu navegador para interactuar con la interfaz gráfica de la aplicación.
