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
import { useLocalStorage } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import DiplomadoGEBotones from "../../assets/diplomado-etnicos/sm_botones.jpg";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

function getBanner(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoSmallBanner : CursoBanner;
        case "20hr-institucional":
            return small ? DiplomadoSmallBanner : DiplomadoBanner;
        case "diplomado":
            return small ? DiplomadoGESmall : DiplomadoGE;
    }
}

function getFooter(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoSmallFooter : CursoFooter;
        case "20hr-institucional":
            return small ? DiplomadoSmallFooter : DiplomadoFooter;
        case "diplomado":
            return small ? DiplomadoGESmallFooter : DiplomadoGEFooter;
    }
}

function getButtonsFooter(curso, small) {
    switch (curso) {
        case "20hr":
            return small ? CursoBotones : CursoFooter;
        case "20hr-institucional":
            return small ? DiplomadoBotones : DiplomadoFooter;
        case "diplomado":
            return small ? DiplomadoGEBotones : DiplomadoGEFooter;
    }
}

export function useLoadForm() {
    const [form, saveForm] = useLocalStorage("form", {});

    const expires = form.expires ? dayjs(form.expires) : null;
    const isAfter = expires ? dayjs().isAfter(expires) : false;

    // Si expira el form, se limpia
    if (expires && isAfter) return [{}, saveForm];
    return [form.values, saveForm];
}

export function useSaveForm() {
    const { control } = useFormContext();
    const values = useWatch({ control });

    useEffect(() => {
        const saveImage = async () => {
            values.frontDocument = null;
            values.backDocument = null;

            localStorage.setItem(
                "form",
                JSON.stringify({
                    values,
                    expires: dayjs().add(1, "hour").format(),
                }),
            );
        };

        saveImage();
    }, [values]);
}

export { getBanner, getButtonsFooter, getFooter };

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

export { replaceAllSpaces, toUpperCase, trimSpaces };
