-- ==========================================================
-- INSERTS DE PRUEBA: PACIENTES
-- ==========================================================

-- PACIENTE 1: Juan Pérez Gómez
-- ─────────────────────────────────────────────────────────
INSERT INTO pacientes (
    id_tipo_documento, numero_documento, nombre_completo,
    fecha_nacimiento, sexo, estado_civil, ocupacion,
    direccion, telefono, id_eps, tipo_vinculacion
) VALUES (
    1, '123456789', 'Juan Pérez Gómez',
    '1990-05-15', 'M', 'Soltero', 'Ingeniero',
    'Calle 80 # 45-20', '3001234567', 
    (SELECT id FROM cat_eps WHERE codigo = 'SURA'), 
    'Contributivo'
);
-- ─────────────────────────────────────────────────────────

-- PACIENTE 2: Ana Rodríguez López
-- ─────────────────────────────────────────────────────────
INSERT INTO pacientes (
    id_tipo_documento, numero_documento, nombre_completo,
    fecha_nacimiento, sexo, estado_civil, ocupacion,
    direccion, telefono, id_eps, tipo_vinculacion
) VALUES (
    2, '987654321', 'Ana Rodríguez López',
    '1985-09-22', 'F', 'Casada', 'Profesora',
    'Carrera 15 # 100-30', '3109876543',
    (SELECT id FROM cat_eps WHERE codigo = 'SANITAS'),
    'Contributivo'
);
-- ─────────────────────────────────────────────────────────

-- PACIENTE 3: Carlos Martínez Suárez
-- ─────────────────────────────────────────────────────────
INSERT INTO pacientes (
    id_tipo_documento, numero_documento, nombre_completo,
    fecha_nacimiento, sexo, estado_civil, ocupacion,
    direccion, telefono, id_eps, tipo_vinculacion
) VALUES (
    (SELECT id FROM cat_tipos_documento WHERE codigo = 'CE'), 
    '1122334455', 'Carlos Martínez Suárez',
    '2005-01-10', 'M', 'Soltero', 'Estudiante',
    'Avenida 68 # 45-12', '3151122334',
    (SELECT id FROM cat_eps WHERE codigo = 'COMPENSAR'),
    'Beneficiario'
);
-- ==========================================================



-- ==========================================================
-- MÓDULO: MEDICIONES TÉCNICAS
-- INSERTS DE PRUEBA CORREGIDOS
-- ==========================================================

-- ─────────────────────────────────────────────────────────
-- PACIENTE 1 - Consulta 1 (15/01/2024 - Miopía simple)
-- ─────────────────────────────────────────────────────────
WITH c1 AS (
    INSERT INTO consultas (
        id_paciente, id_optometra, fecha_consulta,
        motivo_consulta, ultimo_control,
        ant_personales, ant_familiares,
        examen_externo, tonometria_od, tonometria_oi,
        test_color, fondo_ojo,
        diagnostico, conducta,
        control_sugerido, remision,
        id_estado_consulta
    ) VALUES (
        1, 2, '2024-01-15 10:30:00',
        'Visión borrosa de lejos', 'Nunca',
        'No refiere antecedentes', 'Madre miope',
        'Normal', '16', '16',
        'Normal', 'Normal',
        'Miopía simple', 'Se formula lentes monofocales',
        '6 meses', '',
        2
    ) RETURNING id
)
INSERT INTO mediciones_optometricas (
    id_consulta,
    -- Rx en Uso
    rx_uso_od_esfera, rx_uso_od_cilindro, rx_uso_od_eje, rx_uso_od_av_vl,
    rx_uso_oi_esfera, rx_uso_oi_cilindro, rx_uso_oi_eje, rx_uso_oi_av_vl,
    -- VP
    vp_od, vp_oi,
    -- Lente en uso
    lente_uso,
    -- K/M
    km_od, km_od_observaciones,
    km_oi, km_oi_observaciones,
    -- Rx intermedia
    rx_od, rx_od_observaciones,
    rx_oi, rx_oi_observaciones,
    -- Modalidad
    modalidad_ppc, modalidad_lejos, modalidad_cerca,
    -- Test de Titmus
    test_titmus,
    -- Rx Final
    od_esfera, od_cilindro, od_eje, od_av_vl,
    oi_esfera, oi_cilindro, oi_eje, oi_av_vl,
    adicion, distancia_pupilar,
    id_material, id_tipo_lente, observaciones_rx
) SELECT
    c1.id,
    -- Rx en Uso
    -2.25, -0.25, 180, '20/40',
    -2.00, -0.25, 175, '20/40',
    -- VP
    '20/30', '20/30',
    -- Lente en uso
    'Monofocal',
    -- K/M
    '42.00 / 43.00 x 90', 'Sin novedad',
    '42.25 / 43.25 x 85', 'Sin novedad',
    -- Rx intermedia
    '-2.50 -0.50 x 180', 'Acepta bien',
    '-2.25 -0.50 x 175', 'Acepta bien',
    -- Modalidad
    'Ortoforia', 'Ortoforia', 'Ortoforia',
    -- Test de Titmus
    '40 seg arco',
    -- Rx Final
    -2.50, -0.50, 180, '20/20',
    -2.25, -0.50, 175, '20/20',
    0.00, '64 mm',
    (SELECT id FROM cat_materiales WHERE codigo = 'CR39'),
    (SELECT id FROM cat_tipos_lente WHERE codigo = 'MONO'),
    'Lente CR-39 monofocal'
FROM c1;

-- ─────────────────────────────────────────────────────────
-- PACIENTE 1 - Consulta 2 (15/07/2024 - Control)
-- ─────────────────────────────────────────────────────────
WITH c2 AS (
    INSERT INTO consultas (
        id_paciente, id_optometra, fecha_consulta,
        motivo_consulta, ultimo_control,
        ant_personales, ant_familiares,
        examen_externo, tonometria_od, tonometria_oi,
        test_color, fondo_ojo,
        diagnostico, conducta,
        control_sugerido, remision,
        id_estado_consulta
    ) VALUES (
        1, 2, '2024-07-15 11:00:00',
        'Control de miopía', 'Hace 6 meses',
        'Usa lentes regularmente', 'Madre miope',
        'Normal', '16', '16',
        'Normal', 'Normal',
        'Miopía estable', 'Se mantiene fórmula anterior',
        '1 año', '',
        2
    ) RETURNING id
)
INSERT INTO mediciones_optometricas (
    id_consulta,
    rx_uso_od_esfera, rx_uso_od_cilindro, rx_uso_od_eje, rx_uso_od_av_vl,
    rx_uso_oi_esfera, rx_uso_oi_cilindro, rx_uso_oi_eje, rx_uso_oi_av_vl,
    vp_od, vp_oi,
    lente_uso,
    km_od, km_od_observaciones,
    km_oi, km_oi_observaciones,
    rx_od, rx_od_observaciones,
    rx_oi, rx_oi_observaciones,
    modalidad_ppc, modalidad_lejos, modalidad_cerca,
    test_titmus,
    od_esfera, od_cilindro, od_eje, od_av_vl,
    oi_esfera, oi_cilindro, oi_eje, oi_av_vl,
    adicion, distancia_pupilar,
    id_material, id_tipo_lente, observaciones_rx
) SELECT
    c2.id,
    -2.50, -0.50, 180, '20/20',
    -2.25, -0.50, 175, '20/20',
    '20/25', '20/25',
    'Monofocal',
    '42.00 / 43.00 x 90', 'Sin novedad',
    '42.25 / 43.25 x 85', 'Sin novedad',
    '-2.50 -0.50 x 180', 'Sin cambio',
    '-2.25 -0.50 x 175', 'Sin cambio',
    'Ortoforia', 'Ortoforia', 'Ortoforia',
    '40 seg arco',
    -2.50, -0.50, 180, '20/20',
    -2.25, -0.50, 175, '20/20',
    0.00, '64 mm',
    (SELECT id FROM cat_materiales WHERE codigo = 'CR39'),
    (SELECT id FROM cat_tipos_lente WHERE codigo = 'MONO'),
    'Misma fórmula - sin cambios'
FROM c2;

-- ─────────────────────────────────────────────────────────
-- PACIENTE 1 - Consulta 3 (15/11/2024 - Astigmatismo progresivo)
-- ─────────────────────────────────────────────────────────
WITH c3 AS (
    INSERT INTO consultas (
        id_paciente, id_optometra, fecha_consulta,
        motivo_consulta, ultimo_control,
        ant_personales, ant_familiares,
        examen_externo, tonometria_od, tonometria_oi,
        test_color, fondo_ojo,
        diagnostico, conducta,
        control_sugerido, remision,
        id_estado_consulta
    ) VALUES (
        1, 2, '2024-11-15 10:30:00',
        'Visión borrosa nuevamente', 'Hace 4 meses',
        'Refiere empeoramiento', 'Madre miope, padre astigmático',
        'Normal', '16', '16',
        'Normal', 'Normal',
        'Astigmatismo progresivo', 'Se actualiza fórmula',
        '6 meses', '',
        2
    ) RETURNING id
)
INSERT INTO mediciones_optometricas (
    id_consulta,
    rx_uso_od_esfera, rx_uso_od_cilindro, rx_uso_od_eje, rx_uso_od_av_vl,
    rx_uso_oi_esfera, rx_uso_oi_cilindro, rx_uso_oi_eje, rx_uso_oi_av_vl,
    vp_od, vp_oi,
    lente_uso,
    km_od, km_od_observaciones,
    km_oi, km_oi_observaciones,
    rx_od, rx_od_observaciones,
    rx_oi, rx_oi_observaciones,
    modalidad_ppc, modalidad_lejos, modalidad_cerca,
    test_titmus,
    od_esfera, od_cilindro, od_eje, od_av_vl,
    oi_esfera, oi_cilindro, oi_eje, oi_av_vl,
    adicion, distancia_pupilar,
    id_material, id_tipo_lente, observaciones_rx
) SELECT
    c3.id,
    -2.50, -0.50, 180, '20/25',
    -2.25, -0.50, 175, '20/25',
    '20/30', '20/30',
    'Monofocal',
    '42.50 / 43.75 x 90', 'Leve aumento cilindro',
    '42.75 / 44.00 x 85', 'Leve aumento cilindro',
    '-2.50 -0.75 x 180', 'Progresión cilindro',
    '-2.25 -0.75 x 175', 'Progresión cilindro',
    'Ortoforia', 'Ortoforia', 'Ortoforia',
    '40 seg arco',
    -2.50, -0.75, 180, '20/25',
    -2.25, -0.75, 175, '20/25',
    0.00, '64 mm',
    (SELECT id FROM cat_materiales WHERE codigo = 'PC'),
    (SELECT id FROM cat_tipos_lente WHERE codigo = 'MONO'),
    'Aumento de cilindro - se recomienda nuevo par con policarbonato'
FROM c3;

-- Acompañante consulta 3
INSERT INTO acompanantes (id_consulta, nombre, id_parentesco, telefono)
SELECT id, 'María Pérez', (SELECT id FROM cat_parentescos WHERE codigo = 'HIJO'), '3007654321'
FROM consultas
WHERE id_paciente = 1
ORDER BY fecha_consulta DESC
LIMIT 1;

-- ─────────────────────────────────────────────────────────
-- PACIENTE 2 - Ana Rodríguez López
-- ─────────────────────────────────────────────────────────
WITH c4 AS (
    INSERT INTO consultas (
        id_paciente, id_optometra, fecha_consulta,
        motivo_consulta, ultimo_control,
        ant_personales, ant_familiares,
        examen_externo, tonometria_od, tonometria_oi,
        test_color, fondo_ojo,
        diagnostico, conducta,
        control_sugerido, remision,
        id_estado_consulta
    ) VALUES (
        2, 2, '2024-11-20 15:45:00',
        'Dolor de cabeza y visión borrosa', 'Nunca',
        'Usa lentes desde hace 5 años', 'Sin antecedentes familiares',
        'Normal', '18', '18',
        'Normal', 'Normal',
        'Astigmatismo compuesto + Hipermetropía', 'Se formula lentes bifocales',
        '1 año', '',
        2
    ) RETURNING id
)
INSERT INTO mediciones_optometricas (
    id_consulta,
    rx_uso_od_esfera, rx_uso_od_cilindro, rx_uso_od_eje, rx_uso_od_av_vl,
    rx_uso_oi_esfera, rx_uso_oi_cilindro, rx_uso_oi_eje, rx_uso_oi_av_vl,
    vp_od, vp_oi,
    lente_uso,
    km_od, km_od_observaciones,
    km_oi, km_oi_observaciones,
    rx_od, rx_od_observaciones,
    rx_oi, rx_oi_observaciones,
    modalidad_ppc, modalidad_lejos, modalidad_cerca,
    test_titmus,
    od_esfera, od_cilindro, od_eje, od_av_vl,
    oi_esfera, oi_cilindro, oi_eje, oi_av_vl,
    adicion, distancia_pupilar,
    id_material, id_tipo_lente, observaciones_rx
) SELECT
    c4.id,
    +0.75, -1.00, 90, '20/40',
    +0.50, -0.75, 85, '20/40',
    '20/30', '20/30',
    'Monofocal',
    '43.00 / 44.50 x 90', 'Sin novedad',
    '43.25 / 44.75 x 85', 'Sin novedad',
    '+1.00 -1.25 x 90', 'Acepta bien',
    '+0.75 -1.00 x 85', 'Acepta bien',
    'Endoforia leve', 'Ortoforia', 'Endoforia leve',
    '50 seg arco',
    +1.00, -1.25, 90, '20/25',
    +0.75, -1.00, 85, '20/25',
    +2.00, '62 mm',
    (SELECT id FROM cat_materiales WHERE codigo = 'PC'),
    (SELECT id FROM cat_tipos_lente WHERE codigo = 'BI'),
    'Lente policarbonato bifocal'
FROM c4;

-- ─────────────────────────────────────────────────────────
-- PACIENTE 3 - Carlos Martínez Suárez
-- ─────────────────────────────────────────────────────────
WITH c5 AS (
    INSERT INTO consultas (
        id_paciente, id_optometra, fecha_consulta,
        motivo_consulta, ultimo_control,
        ant_personales, ant_familiares,
        examen_externo, tonometria_od, tonometria_oi,
        test_color, fondo_ojo,
        diagnostico, conducta,
        control_sugerido, remision,
        id_estado_consulta
    ) VALUES (
        3, 2, '2024-11-25 09:00:00',
        'Chequeo rutinario', 'Hace 2 años',
        'Sin antecedentes', 'Abuelo con glaucoma',
        'Normal', '15', '15',
        'Normal', 'Normal',
        'Visión normal', 'No requiere fórmula',
        '2 años', '',
        2
    ) RETURNING id
)
INSERT INTO mediciones_optometricas (
    id_consulta,
    rx_uso_od_esfera, rx_uso_od_cilindro, rx_uso_od_eje, rx_uso_od_av_vl,
    rx_uso_oi_esfera, rx_uso_oi_cilindro, rx_uso_oi_eje, rx_uso_oi_av_vl,
    vp_od, vp_oi,
    lente_uso,
    km_od, km_od_observaciones,
    km_oi, km_oi_observaciones,
    rx_od, rx_od_observaciones,
    rx_oi, rx_oi_observaciones,
    modalidad_ppc, modalidad_lejos, modalidad_cerca,
    test_titmus,
    od_esfera, od_cilindro, od_eje, od_av_vl,
    oi_esfera, oi_cilindro, oi_eje, oi_av_vl,
    adicion, distancia_pupilar,
    id_material, id_tipo_lente, observaciones_rx
) SELECT
    c5.id,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    '20/20', '20/20',
    'Sin lentes',
    '42.00 / 42.50 x 90', 'Normal',
    '42.00 / 42.50 x 90', 'Normal',
    NULL, 'Sin corrección necesaria',
    NULL, 'Sin corrección necesaria',
    'Ortoforia', 'Ortoforia', 'Ortoforia',
    '40 seg arco',
    NULL, NULL, NULL, '20/20',
    NULL, NULL, NULL, '20/20',
    NULL, '60 mm',
    NULL, NULL, 'Sin fórmula requerida'
FROM c5;
-- ==========================================================