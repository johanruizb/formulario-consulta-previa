import os
from datetime import datetime
import shutil


root = os.path.dirname(__file__)
dist = os.path.join(root, "dist")

server = os.path.join(root, "..", "consulta-previa-proxy")
server_dist = os.path.join(server)


def build():
    os.chdir(root)
    os.system("npm run format")
    os.system("npm run build")


def comment_server():
    os.chdir(server_dist)
    # shutil.rmtree(server_dist, ignore_errors=True)
    # shutil.copytree(dist, server_dist, dirs_exist_ok=True, ignore=shutil.ignore_patterns("*.git"))
    os.system("git add .")
    os.system('git commit -m "Actualizar archivos estaticos"')
    os.system("git push origin render-preview")
    # gh pr create --base main --head nombre-de-tu-rama --title "Título del PR" --body "Descripción del PR"
    os.system('gh pr create --base render --head render-preview --title "Actualizar archivos estaticos" --body "Actualización de archivos estaticos"')


def deploy():
    build()
    comment_server()


if __name__ == "__main__":
    deploy()
