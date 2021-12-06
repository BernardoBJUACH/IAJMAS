$(document).ready(function(){
    var genTitle = 'IA - JMAS';
    $('#Instalacion').select2();

    /*
        Pendientes
            * Exportar en modo columna no agrega encabezados principales
            * Mostrar u ocular columnas basado en los checkbox
            * Validar parametros ante de hacer consulta
            * Solo exportar elementos seleccionados
            * Datatable columna js dinamico

        * Vectores por Unidad (Vectorizar btn)                                                          
        10/1/2018       Aeropuert1  10/1/2018   Presion 2.182926829 2.1 1.9 0   2.6 0.227287761 41  Aeropuert2  10/1/2018   Presion 2.807894737
    
        * Seleccionar de multiples tipo de instalacion
        * Poner en repositorio
        * Crear Readme de uso e instalacion
    */
    
    // Inicializar select picker
    $('#RangoFechas').daterangepicker({
        "showWeekNumbers": true,
        "timePicker": true,
        "startDate": '01/01/2018 00:00',
        "endDate": '31/12/2018 23:59',
        "timePickerIncrement": 1,
        "timePicker24Hour": true,
        "locale": {
            "format": 'DD/MM/YYYY H:mm'
        },
        "ranges": {
            'Today': [moment(), moment() + 1],
            'Yesterday': [moment().subtract(1, 'days'), moment()],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "opens": "left",
        "drops": "down",
        "buttonClasses": "btn btn-sm",
        "applyClass": "btn-success",
        "cancelClass": "btn-default"
    });

    // Inicializar datatables
    var dtColumna;
    var dtRenglon = $('#DataTableRenglon').DataTable( {
        lengthChange: false,
        bPaginate: true,
        bSort: true,
        scrollX: false,
        buttons: [ 'copy', 'excel', 'csv', 'pdf' ]
    });
    dtRenglon.buttons().container().appendTo('#WrapperRenglon .col-md-6:eq(0)');
    $('#SelectAllRenglon').on('click', function (e) {
        var rows = dtRenglon.rows({'search': 'applied'}).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    // Cargar instalaciones en base al tipo
    $(document).on('change', '#TipoInstalacion', function () {
        var type = $(this).val();
        
        $('#Instalacion').empty();
        if (type != '') {
            Swal.fire({title: genTitle, html: 'Cargando instalaciones ...', allowOutsideClick: false});
            Swal.showLoading();
            GetInstalacionesTxn(type).then(function (jsonRes) {
                Swal.close();
                $('#Instalacion').append('<option value=""></option>');
                $.each(jsonRes, function (j, obj) {
                    $('#Instalacion').append('<option value="' + obj.Key + '">' + obj.Key + '</option>');
                });
                $('#Instalacion').select2();
            });
        }
    });

    $(document).on('change', '#Instalacion', function () {
        var inst = $(this).val();
        
        if (inst != '') {
            // Validate duplicate
            var find = false;
            $('#Instalaciones li').each(function (i, e) {
                if ($(this).text() == inst) {
                    find = true;
                    return false;
                }
            });

            // Add instalation
            if (!find) {
                $('#Instalaciones').append('<li class="list-group-item pt-1 pb-1 pl-2 pr-2">' + inst + '</li>');
            }
        }
    });

    $(document).on('click', '#btnClear', function () {
        $('#Instalaciones').empty();
    });

    // Generar
    $(document).on('click', '#btnGenerar', function () {
        var instalaciones = [];
        $('#Instalaciones li').each(function (i, e) {
            instalaciones.push($(this).text());
        });

        var txnArgs = {};
        txnArgs.Instalaciones = '\'' + instalaciones.join('\',\'') + '\'';
        txnArgs.FechaInicial = $('#RangoFechas').val().split(' - ')[0];
        txnArgs.FechaFinal = $('#RangoFechas').val().split(' - ')[1];
        txnArgs.Unidad = $('#Unidad').find(':selected').text();
        txnArgs.Formato = $('#Unidad').val();
        txnArgs.Variable = $('#Variable').val();

        // TEST
        // MostrarInformacion(txnArgs, CalcularDatos(jsonTest));

        Swal.fire({title: genTitle, html: 'Obteniendo informacion ...', allowOutsideClick: false});
        Swal.showLoading();
        GetDataTxn(txnArgs).then(function (jsonRes) {
            Swal.close();
            if (jsonRes.length > 0) {
                MostrarInformacion(txnArgs, CalcularDatos(jsonRes));
            } else {
                Swal.fire('Consulta', 'Información no encontrada, intente con diferentes parametros', 'warning');
            }
        });
    });

    function MostrarInformacion(args, array) {
        $('#DivRenglon').addClass('d-none');
        $('#DivColumna').addClass('d-none');

        var organizaPor = $('#OrganizaPor').val();
        var vectorizarPor = $('#VectorizarPor').val();

        $('#Div' + organizaPor).removeClass('d-none');
        var $table = $('#Tab' + organizaPor);
        $table.empty();
        if (organizaPor == 'Renglon') {
            // TODO: vectorizarPor  (Orden de columna Instalacion|Unidad, siempre organizar por columna 2)
            // Header
            $('#lblUnidad').text('Unidad (' + args.Unidad + ')');

            // Body
            dtRenglon.rows().remove();
            $.each(array, function (name, inst) {
                $.each(inst, function (key, unid) {
                    dtRenglon.row.add([
                        '<td class="text-center"><input type="checkbox"></td>',
                        name,
                        key,
                        args.Variable,
                        unid.Media,
                        unid.Mediana,
                        unid.Moda,
                        unid.Minimo,
                        unid.Maximo,
                        unid.DE,
                        unid.Count
                    ]);
                });
            });
            dtRenglon.draw(false);
        } else {
            var dominio = CalcularDominio(array);
            // TODO: Cambiar informacion a json

            // Main Header
            var $mainHeader = $('#TabColumnMainHeader');
            $mainHeader.empty();
            $mainHeader.append('<th class="text-center">&nbsp;</th>');
            $mainHeader.append('<th class="text-center">Unidad (' + args.Unidad + ')</th>');
            if (vectorizarPor == 'Instalacion') {
                $.each(dominio, function (k, val) {
                    $mainHeader.append('<th class="text-center" colspan="7">' + val + '</th>');
                });
            } else {
                $.each(array, function (name, inst) {
                    $mainHeader.append('<th class="text-center" colspan="7">' + name + '</th>');
                });
            }

            // Second Header
            var $secondHeader = $('#TabColumnSecondHeader');
            $secondHeader.empty();
            $secondHeader.append('<th class="text-center"><input type="checkbox" id="SelectAllColumna"> Todo</th>');
            $secondHeader.append('<th class="text-center">' + args.Variable + '</th>');
            if (vectorizarPor == 'Instalacion') {
                $.each(dominio, function (k, val) {
                    $secondHeader.append('<th class="text-center">Media</th>');
                    $secondHeader.append('<th class="text-center">Mediana</th>');
                    $secondHeader.append('<th class="text-center">Moda</th>');
                    $secondHeader.append('<th class="text-center">Mínimo</th>');
                    $secondHeader.append('<th class="text-center">Máximo</th>');
                    $secondHeader.append('<th class="text-center">DE</th>');
                    $secondHeader.append('<th class="text-center">Count</th>');
                });
            } else {
                $.each(array, function (name, inst) {
                    $secondHeader.append('<th class="text-center">Media</th>');
                    $secondHeader.append('<th class="text-center">Mediana</th>');
                    $secondHeader.append('<th class="text-center">Moda</th>');
                    $secondHeader.append('<th class="text-center">Mínimo</th>');
                    $secondHeader.append('<th class="text-center">Máximo</th>');
                    $secondHeader.append('<th class="text-center">DE</th>');
                    $secondHeader.append('<th class="text-center">Count</th>');
                });
            }

            // Body
            if (vectorizarPor == 'Instalacion') {
                $.each(array, function (name, inst) {
                    var row = '<tr>';
                    row += '    <td class="text-center"><input type="checkbox"></td>';
                    row += '    <td class="text-center">' + name + '</td>';

                    $.each(dominio, function (k, val) {
                        var obj = inst[val];
                        if (obj == null) {
                            obj = { "Count": 0, "DE": 0, "Maximo": 0, "Media": 0, "Mediana": 0, "Minimo": 0, "Moda": 0, "Suma": 0 };
                        }
                        row += '    <td class="text-center">' + obj.Media + '</td>';
                        row += '    <td class="text-center">' + obj.Mediana + '</td>';
                        row += '    <td class="text-center">' + obj.Moda + '</td>';
                        row += '    <td class="text-center">' + obj.Minimo + '</td>';
                        row += '    <td class="text-center">' + obj.Maximo + '</td>';
                        row += '    <td class="text-center">' + obj.DE + '</td>';
                        row += '    <td class="text-center">' + obj.Count + '</td>';
                    });
                    row += '</tr>';

                    $table.append(row);
                });
            } else {
                $.each(dominio, function (k, val) {
                    var row = '<tr>';
                    row += '    <td class="text-center"><input type="checkbox"></td>';
                    row += '    <td class="text-center">' + val + '</td>';

                    $.each(array, function (name, inst) {
                        var obj = inst[val];
                        if (obj == null) {
                            obj = { "Count": 0, "DE": 0, "Maximo": 0, "Media": 0, "Mediana": 0, "Minimo": 0, "Moda": 0, "Suma": 0 };
                        }
                        row += '    <td class="text-center">' + obj.Media + '</td>';
                        row += '    <td class="text-center">' + obj.Mediana + '</td>';
                        row += '    <td class="text-center">' + obj.Moda + '</td>';
                        row += '    <td class="text-center">' + obj.Minimo + '</td>';
                        row += '    <td class="text-center">' + obj.Maximo + '</td>';
                        row += '    <td class="text-center">' + obj.DE + '</td>';
                        row += '    <td class="text-center">' + obj.Count + '</td>';
                    });
                    row += '</tr>';

                    $table.append(row);
                });
            }
                

            // Datatable
            if (dtColumna != null) {
                dtColumna.destroy();
                dtColumna = null;
            }
            dtColumna = $('#DataTableColumna').DataTable( {
                lengthChange: false,
                bPaginate: true,
                bSort: false,
                scrollX: true,
                buttons: [ 'copy', 'excel', 'csv', 'pdf', 'colvis' ]
            });
            dtColumna.buttons().container().appendTo('#WrapperColumna .col-md-6:eq(0)');
            $('#SelectAllColumna').on('click', function (e) {
                var rows = dtColumna.rows({'search': 'applied'}).nodes();
                $('input[type="checkbox"]', rows).prop('checked', this.checked);
            });
        }
    }

    function CalcularDatos(array) {
        // Agrupar informacion por instalacion
        var instalaciones = array.reduce(function (r, a) {
            r[a.Instalacion] = r[a.Instalacion] || [];
            r[a.Instalacion].push(a);
            return r;
        }, Object.create(null));

        // Agrupar informacion por unidad
        $.each(instalaciones, function (inst) {
            instalaciones[inst] = instalaciones[inst].reduce(function (r, a) {
                r[a.Unidad] = r[a.Unidad] || [];
                r[a.Unidad].push(parseFloat(a.Valor));
                return r;
            }, Object.create(null));
        });

        // Calcular informacion
        $.each(instalaciones, function (i, inst) {
            $.each(inst, function (j, unid) {
                var obj = {};
                obj.Count = unid.length;
                obj.Suma = unid.reduce((partial, obj) =>
                    partial + obj
                , 0) || 0;
                obj.Media = unid.reduce(function (avg, obj, _, { length }) {
                    return avg + obj / length;
                }, 0);
                obj.Minimo = unid.reduce((min, obj) => {
                    min = (min === undefined || obj < min) ? obj : min
                    return min;
                }, 0);
                obj.Maximo = unid.reduce((max, obj) => {
                    max = (max === undefined || obj > max) ? obj : max
                    return max;
                }, 0);

                // Desviacion estandar
                const n = unid.length
                const mean = unid.reduce((a, b) => a + b) / n
                obj.DE = Math.sqrt(unid.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);

                // Obtener mediana
                var sorted = unid.sort(function(a, b) {
                    return a - b;
                });
                obj.Mediana = sorted[parseInt(unid.length / 2)];

                // Obtener moda
                const unidCount = {};
                unid.map(
                    function (elemento) {
                        if (unidCount[elemento]) {
                            unidCount[elemento] += 1;
                        } else {
                            unidCount[elemento] = 1;
                        }
                    }
                );
                const unidArray = Object.entries(unidCount).sort(
                    function (elementoA, elementoB) {
                        return elementoA[1] - elementoB[1];
                    }
                );
                obj.Moda = parseFloat(unidArray[unidArray.length - 1][0]);

                instalaciones[i][j] = obj;
            });
        });

        return instalaciones;
    }

    function CalcularDominio(array) {
        var dominio = [];
        $.each(array, function (name, inst) {
            $.each(inst, function (key, unid) {
                if(dominio.indexOf(key) === -1) {
                    dominio.push(key);
                }
            });
        });

        return dominio.sort();
    }

    // GetDataTxn
    async function GetDataTxn(txnArgs) {
        return await ExecuteTransaction('txn/jsonData.php', txnArgs);
    }

    // GetInstalacionesTxn
    async function GetInstalacionesTxn(type) {
        var txnArgs = {};
        txnArgs.Type = type;

        return await ExecuteTransaction('txn/jsonInstalaciones.php', txnArgs);
    }

    // Execute transaction
    function ExecuteTransaction(url, txnArgs) {
        console.log(txnArgs);
        return new Promise(resolve => {
            $.post(url, txnArgs, function (jsonRes) {
                resolve(jsonRes);
            }, "json").fail(function (data) {
                console.log('Transaction result:');
                console.log(data);
                Swal.fire({
                    allowOutsideClick: false,
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la transaccion'
                });
            });
        });
    }
});