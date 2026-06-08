package oft.optica.consultas.mediciones;

import oft.optica.catalogos.material.MaterialEntity;
import oft.optica.catalogos.tipo_lente.TipoLenteEntity;
import oft.optica.consultas.ConsultaEntity;
import org.springframework.stereotype.Component;

@Component
public class MedicionOptometricaMapper {

    public MedicionOptometricaResponse toDTO(MedicionOptometricaEntity medicion) {
        return new MedicionOptometricaResponse(
                medicion.getId(),
                medicion.getConsulta().getId(),
                // Rx en uso
                medicion.getRxUsoOdEsfera(),
                medicion.getRxUsoOdCilindro(),
                medicion.getRxUsoOdEje(),
                medicion.getRxUsoOdAvVl(),
                medicion.getRxUsoOiEsfera(),
                medicion.getRxUsoOiCilindro(),
                medicion.getRxUsoOiEje(),
                medicion.getRxUsoOiAvVl(),
                // Visión próxima
                medicion.getVpOd(),
                medicion.getVpOi(),
                medicion.getLenteUso(),
                // Queratometría
                medicion.getKmOd(),
                medicion.getKmOdObservaciones(),
                medicion.getKmOi(),
                medicion.getKmOiObservaciones(),
                // Refracción intermedia
                medicion.getRxOd(),
                medicion.getRxOdObservaciones(),
                medicion.getRxOi(),
                medicion.getRxOiObservaciones(),
                // Modalidad
                medicion.getModalidadPpc(),
                medicion.getModalidadLejos(),
                medicion.getModalidadCerca(),
                medicion.getTestTitmus(),
                // Rx Final OD
                medicion.getOdEsfera(),
                medicion.getOdCilindro(),
                medicion.getOdEje(),
                medicion.getOdAvVl(),
                // Rx Final OI
                medicion.getOiEsfera(),
                medicion.getOiCilindro(),
                medicion.getOiEje(),
                medicion.getOiAvVl(),
                // Complementarios
                medicion.getAdicion(),
                medicion.getDistanciaPupilar(),
                medicion.getMaterial() != null ? medicion.getMaterial().getCodigo() : null,
                medicion.getTipoLente() != null ? medicion.getTipoLente().getCodigo() : null,
                medicion.getObservacionesRx());
    }

    public MedicionOptometricaEntity toEntity(
            MedicionOptometricaRequest dto,
            ConsultaEntity consulta,
            MaterialEntity material,
            TipoLenteEntity tipoLente) {

        return MedicionOptometricaEntity
                .builder().
                consulta(consulta)
                .rxUsoOdEsfera(dto.rxUsoOdEsfera())
                .rxUsoOdCilindro(dto.rxUsoOdCilindro())
                .rxUsoOdEje(dto.rxUsoOdEje())
                .rxUsoOdAvVl(dto.rxUsoOdAvVl())
                .rxUsoOiEsfera(dto.rxUsoOiEsfera())
                .rxUsoOiCilindro(dto.rxUsoOiCilindro())
                .rxUsoOiEje(dto.rxUsoOiEje())
                .rxUsoOiAvVl(dto.rxUsoOiAvVl())
                .vpOd(dto.vpOd())
                .vpOi(dto.vpOi())
                .lenteUso(dto.lenteUso())
                .kmOd(dto.kmOd())
                .kmOdObservaciones(dto.kmOdObservaciones())
                .kmOi(dto.kmOi())
                .kmOiObservaciones(dto.kmOiObservaciones())
                .rxOd(dto.rxOd())
                .rxOdObservaciones(dto.rxOdObservaciones())
                .rxOi(dto.rxOi())
                .rxOiObservaciones(dto.rxOiObservaciones())
                .modalidadPpc(dto.modalidadPpc())
                .modalidadLejos(dto.modalidadLejos())
                .modalidadCerca(dto.modalidadCerca())
                .testTitmus(dto.testTitmus())
                .odEsfera(dto.odEsfera())
                .odCilindro(dto.odCilindro())
                .odEje(dto.odEje())
                .odAvVl(dto.odAvVl())
                .oiEsfera(dto.oiEsfera())
                .oiCilindro(dto.oiCilindro())
                .oiEje(dto.oiEje())
                .oiAvVl(dto.oiAvVl())
                .adicion(dto.adicion())
                .distanciaPupilar(dto.distanciaPupilar())
                .material(material).tipoLente(tipoLente)
                .observacionesRx(dto.observacionesRx())
                .build();
    }

    public void updateEntity(
            MedicionOptometricaEntity medicion,
            MedicionOptometricaRequest dto,
            MaterialEntity material,
            TipoLenteEntity tipoLente) {

        medicion.setRxUsoOdEsfera(dto.rxUsoOdEsfera());
        medicion.setRxUsoOdCilindro(dto.rxUsoOdCilindro());
        medicion.setRxUsoOdEje(dto.rxUsoOdEje());
        medicion.setRxUsoOdAvVl(dto.rxUsoOdAvVl());
        medicion.setRxUsoOiEsfera(dto.rxUsoOiEsfera());
        medicion.setRxUsoOiCilindro(dto.rxUsoOiCilindro());
        medicion.setRxUsoOiEje(dto.rxUsoOiEje());
        medicion.setRxUsoOiAvVl(dto.rxUsoOiAvVl());
        medicion.setVpOd(dto.vpOd());
        medicion.setVpOi(dto.vpOi());
        medicion.setLenteUso(dto.lenteUso());
        medicion.setKmOd(dto.kmOd());
        medicion.setKmOdObservaciones(dto.kmOdObservaciones());
        medicion.setKmOi(dto.kmOi());
        medicion.setKmOiObservaciones(dto.kmOiObservaciones());
        medicion.setRxOd(dto.rxOd());
        medicion.setRxOdObservaciones(dto.rxOdObservaciones());
        medicion.setRxOi(dto.rxOi());
        medicion.setRxOiObservaciones(dto.rxOiObservaciones());
        medicion.setModalidadPpc(dto.modalidadPpc());
        medicion.setModalidadLejos(dto.modalidadLejos());
        medicion.setModalidadCerca(dto.modalidadCerca());
        medicion.setTestTitmus(dto.testTitmus());
        medicion.setOdEsfera(dto.odEsfera());
        medicion.setOdCilindro(dto.odCilindro());
        medicion.setOdEje(dto.odEje());
        medicion.setOdAvVl(dto.odAvVl());
        medicion.setOiEsfera(dto.oiEsfera());
        medicion.setOiCilindro(dto.oiCilindro());
        medicion.setOiEje(dto.oiEje());
        medicion.setOiAvVl(dto.oiAvVl());
        medicion.setAdicion(dto.adicion());
        medicion.setDistanciaPupilar(dto.distanciaPupilar());
        medicion.setMaterial(material);
        medicion.setTipoLente(tipoLente);
        medicion.setObservacionesRx(dto.observacionesRx());
    }
}
