import os


def obtener_extensiones(carpeta):
    extensiones = []
    # Recorrer todos los directorios y archivos
    for root, dirs, files in os.walk(carpeta):
        for file in files:
            # Obtener la extensión del archivo
            extension = os.path.splitext(file)[1]
            if extension:  # Verificar que tenga extensión
                extensiones.append(extension)
    return set(extensiones)


# Ejemplo de uso
carpeta = os.path.join(os.getcwd(), "dist")
extensiones = obtener_extensiones(carpeta)
print(extensiones)
