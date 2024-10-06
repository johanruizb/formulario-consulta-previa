import CursoBanner from "../../assets/curso/banner.jpg";
import CursoSmallBanner from "../../assets/curso/sm_banner.jpg";

import CursoFooter from "../../assets/curso/footer.jpg";
import CursoSmallFooter from "../../assets/curso/sm_footer.jpg";

import DiplomadoBanner from "../../assets/diplomado/banner.jpg";
import DiplomadoSmallBanner from "../../assets/diplomado/sm_banner.jpg";

import DiplomadoFooter from "../../assets/diplomado/footer.jpg";
import DiplomadoSmallFooter from "../../assets/diplomado/sm_footer.jpg";

// Botones

import CursoBotones from "../../assets/curso/sm_botones.jpg";
import DiplomadoBotones from "../../assets/diplomado/sm_botones.jpg";

function getBanner(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoSmallBanner : CursoBanner;
        case "20hr-institucional":
            return small ? DiplomadoSmallBanner : DiplomadoBanner;
    }
}

function getFooter(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoSmallFooter : CursoFooter;
        case "20hr-institucional":
            return small ? DiplomadoSmallFooter : DiplomadoFooter;
    }
}

function getButtonsFooter(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoBotones : CursoFooter;
        case "20hr-institucional":
            return small ? DiplomadoBotones : DiplomadoFooter;
    }
}

export { getBanner, getFooter, getButtonsFooter };
