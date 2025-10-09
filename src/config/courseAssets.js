import CursoBanner from "../assets/curso/banner.jpg";
import CursoFooter from "../assets/curso/footer.jpg";
import CursoSmallBanner from "../assets/curso/sm_banner.jpg";
import CursoBotones from "../assets/curso/sm_botones.jpg";
import CursoSmallFooter from "../assets/curso/sm_footer.jpg";
import DiplomadoGE from "../assets/diplomado-etnicos/banner.jpg";
import DiplomadoGEFooter from "../assets/diplomado-etnicos/footer.jpg";
import DiplomadoGESmall from "../assets/diplomado-etnicos/sm_banner.jpg";
import DiplomadoGEBotones from "../assets/diplomado-etnicos/sm_botones.jpg";
import DiplomadoGESmallFooter from "../assets/diplomado-etnicos/sm_footer.jpg";
import DiplomadoBanner from "../assets/diplomado/banner.jpg";
import DiplomadoFooter from "../assets/diplomado/footer.jpg";
import DiplomadoSmallBanner from "../assets/diplomado/sm_banner.jpg";
import DiplomadoBotones from "../assets/diplomado/sm_botones.jpg";
import DiplomadoSmallFooter from "../assets/diplomado/sm_footer.jpg";

/**
 * Configuración centralizada de assets por curso
 * Reemplaza los switch statements duplicados
 */
export const COURSE_ASSETS = {
    "20hr": {
        banner: {
            small: CursoSmallBanner,
            large: CursoBanner,
        },
        footer: {
            small: CursoSmallFooter,
            large: CursoFooter,
        },
        buttons: {
            small: CursoBotones,
            large: CursoFooter,
        },
    },
    "20hr-institucional": {
        banner: {
            small: DiplomadoSmallBanner,
            large: DiplomadoBanner,
        },
        footer: {
            small: DiplomadoSmallFooter,
            large: DiplomadoFooter,
        },
        buttons: {
            small: DiplomadoBotones,
            large: DiplomadoFooter,
        },
    },
    diplomado: {
        banner: {
            small: DiplomadoGESmall,
            large: DiplomadoGE,
        },
        footer: {
            small: DiplomadoGESmallFooter,
            large: DiplomadoGEFooter,
        },
        buttons: {
            small: DiplomadoGEBotones,
            large: DiplomadoGEFooter,
        },
    },
};

/**
 * Obtiene un asset específico para un curso
 * @param {string} courseId - ID del curso
 * @param {string} assetType - Tipo de asset (banner, footer, buttons)
 * @param {boolean} isSmall - Si debe retornar la versión small
 * @returns {string|undefined} URL del asset
 */
export function getCourseAsset(courseId, assetType, isSmall = false) {
    const size = isSmall ? "small" : "large";
    return COURSE_ASSETS[courseId]?.[assetType]?.[size];
}

/**
 * Funciones de compatibilidad con código existente
 */
export function getBanner(curso, small) {
    return getCourseAsset(curso, "banner", small);
}

export function getFooter(curso, small) {
    return getCourseAsset(curso, "footer", small);
}

export function getButtonsFooter(curso, small) {
    return getCourseAsset(curso, "buttons", small);
}
