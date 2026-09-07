import numpy as np

def calculate_least_squares_potential(x_list, y_list):
    """
    Calcula el ajuste de mínimos cuadrados para un modelo potencial: y = a * x^b
    Linearización: ln(y) = ln(a) + b * ln(x)
    """
    # Convertir a numpy arrays
    x = np.array(x_list, dtype=np.float64)
    y = np.array(y_list, dtype=np.float64)
    
    # 1. Linealización
    X = np.log(x)
    Y = np.log(y)
    
    # 2. Sumatorias
    n = len(x)
    sum_X = np.sum(X)
    sum_Y = np.sum(Y)
    sum_X2 = np.sum(X**2)
    sum_XY = np.sum(X * Y)
    
    # 3. Resolver sistema 2x2 para A y b
    # n * A + sum_X * b = sum_Y
    # sum_X * A + sum_X2 * b = sum_XY
    
    denominator = n * sum_X2 - sum_X**2
    if denominator == 0:
        raise ValueError("El denominador es 0. No se puede resolver el sistema.")
        
    b = (n * sum_XY - sum_X * sum_Y) / denominator
    A = (sum_Y - b * sum_X) / n
    
    # 4. Parámetro original 'a'
    a = np.exp(A)
    
    # 5. Cálculo de Bondad del Ajuste (r^2) sobre el modelo original
    y_mean = np.mean(y)
    S_t = np.sum((y - y_mean)**2)
    
    # Valores predichos teóricos
    y_pred = a * (x**b)
    S_r = np.sum((y - y_pred)**2)
    
    r2 = (S_t - S_r) / S_t
    
    # Generar puntos de la curva teórica para suavizado en el frontend
    x_min, x_max = np.min(x), np.max(x)
    # Generar puntos uniformes en espacio logarítmico para mejor renderizado
    x_curve = np.logspace(np.log10(x_min), np.log10(x_max), 50)
    y_curve = a * (x_curve**b)
    
    return {
        "a": float(a),
        "b": float(b),
        "equation": f"y = {a:.4f} \\cdot x^{{{b:.4f}}}",
        "r2": float(r2),
        "S_t": float(S_t),
        "S_r": float(S_r),
        "curve": [{"x": float(xc), "y": float(yc)} for xc, yc in zip(x_curve, y_curve)]
    }
