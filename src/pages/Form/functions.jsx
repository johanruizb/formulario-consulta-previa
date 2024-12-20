// Curso - Grupos etnicos
import CursoBanner from "../../assets/curso/banner.jpg";
import CursoSmallBanner from "../../assets/curso/sm_banner.jpg";

import CursoFooter from "../../assets/curso/footer.jpg";
import CursoSmallFooter from "../../assets/curso/sm_footer.jpg";

// Curso - Funcionarios
import DiplomadoBanner from "../../assets/diplomado/banner.jpg";
import DiplomadoSmallBanner from "../../assets/diplomado/sm_banner.jpg";

import DiplomadoFooter from "../../assets/diplomado/footer.jpg";
import DiplomadoSmallFooter from "../../assets/diplomado/sm_footer.jpg";

// Botones
import CursoBotones from "../../assets/curso/sm_botones.jpg";
import DiplomadoBotones from "../../assets/diplomado/sm_botones.jpg";

// Diplomado - Grupos etnicos
import DiplomadoGE from "../../assets/diplomado-etnicos/banner.jpg";
import DiplomadoGESmall from "../../assets/diplomado-etnicos/sm_banner.jpg";

import DiplomadoGEFooter from "../../assets/diplomado-etnicos/footer.jpg";
import DiplomadoGESmallFooter from "../../assets/diplomado-etnicos/sm_footer.jpg";

// Diplomado - botones
import DiplomadoGEBotones from "../../assets/diplomado-etnicos/sm_footer.jpg";

function getBanner(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoSmallBanner : CursoBanner;
        case "20hr-institucional":
            return small ? DiplomadoSmallBanner : DiplomadoBanner;
        case "diplomado-etnicos":
            return small ? DiplomadoGESmall : DiplomadoGE;
    }
}

function getFooter(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoSmallFooter : CursoFooter;
        case "20hr-institucional":
            return small ? DiplomadoSmallFooter : DiplomadoFooter;
        case "diplomado-etnicos":
            return small ? DiplomadoGESmallFooter : DiplomadoGEFooter;
    }
}

function getButtonsFooter(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoBotones : CursoFooter;
        case "20hr-institucional":
            return small ? DiplomadoBotones : DiplomadoFooter;
        case "diplomado-etnicos":
            return small ? DiplomadoGEBotones : DiplomadoGEFooter;
    }
}

export { getBanner, getFooter, getButtonsFooter };

const replaceAllSpaces = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.replaceAll(" ", "") ?? "";
    onBlur?.(e);
    onChange?.(e);
};

const trimSpaces = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.trim() ?? "";
    onBlur?.(e);
    onChange?.(e);
};

const toUpperCase = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.toUpperCase() ?? "";
    onBlur?.(e);
    onChange?.(e);
};

export { replaceAllSpaces, trimSpaces, toUpperCase };
