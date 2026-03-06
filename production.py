import os
import requests
from dotenv import load_dotenv

load_dotenv()

root = os.path.dirname(__file__)
dist = os.path.join(root, "dist")

server = os.path.join(root, "..", "consulta-previa-proxy")
server_dist = os.path.join(server)


def build():
    os.chdir(root)
    os.system("npm run format")
    os.system("npm run build")


def create_github_pr():
    """
    Crea un pull request de la rama 'render' a 'render-preview' usando la API de GitHub
    """
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        print("Error: GITHUB_TOKEN no está configurado en las variables de entorno")
        return False

    # Información del repositorio (debes ajustar según tu repositorio)
    owner = "johanruizb"  # Cambiar por el owner real del repositorio
    repo = "consulta-previa-proxy"  # Cambiar por el nombre real del repositorio

    url = f"https://api.github.com/repos/{owner}/{repo}/pulls"

    headers = {"Authorization": f"token {token}", "Accept": "application/vnd.github.v3+json", "Content-Type": "application/json"}

    data = {"title": "Actualizar archivos estaticos", "body": "Actualización de archivos estaticos", "head": "render-preview", "base": "render"}

    try:
        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 201:
            pr_data = response.json()
            print(f"✅ Pull request creado exitosamente: {pr_data['html_url']}")
            return True
        elif response.status_code == 422:
            body = response.json()
            error_message = body.get("message", "Error desconocido")
            errors = body.get("errors", [])
            print(f"⚠️  No se pudo crear el PR: {error_message}")
            for err in errors:
                detail = err.get("message", err)
                print(f"   → {detail}")
                if "already exists" in str(detail).lower():
                    existing_url = f"https://api.github.com/repos/{owner}/{repo}/pulls"
                    params = {"head": f"{owner}:render-preview", "base": "render", "state": "open"}
                    existing = requests.get(existing_url, headers=headers, params=params)
                    if existing.status_code == 200 and existing.json():
                        print(f"   PR existente: {existing.json()[0]['html_url']}")
            return False
        else:
            print(f"❌ Error al crear el pull request: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión al crear el pull request: {e}")
        return False


def comment_server():
    os.chdir(server_dist)
    os.system("git add .")
    os.system('git commit -m "Actualizar archivos estaticos"')
    os.system("git push origin render-preview")
    create_github_pr()


def deploy():
    build()
    comment_server()


if __name__ == "__main__":
    deploy()
