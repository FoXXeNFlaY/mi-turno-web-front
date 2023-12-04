import Button from "@mui/material/Button";
import { red } from "@mui/material/colors";
import React from "react";
import s from "./style.module.scss";

import { useNavigate } from "react-router";
import axios from "axios";

export const TableList = ({ datatype, data }) => {
  const navigate = useNavigate();
  const handleOnClickEdit = (rid, e) => {
    //validar para distintos botones
    e.preventDefault();
    navigate(`/client/editReservation/${rid}`);
  };
  const handleOnClickCancel = (rid, e) => {
    e.preventDefault();
    navigate(`/client/cancelReservation/${rid}`);
  };
  const handleOnClickDeleteOperator = (oid, e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3001/api/users/admin/deleteOperator/${oid}`)
      .then(() => {
        alert("Se eliminó al operador");
        window.location.reload();
      });
  };

  const handleOnClickDeleteBranch = (id, e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3001/api/users/admin/deleteBranch/${id}`)
      .then(() => {
        alert("Se eliminó la sucursal");
        window.location.reload();
      });
  };

  const dataType = datatype;
  const objKeys = Object.keys(data[0]);

  let column1 = "";
  let column2 = "";
  let column3 = "";
  let column4 = "";

  if (dataType === "Sucursales") {
    column1 = "Nombre";
    column2 = "Correo";
    column3 = "Capacidad";
    column4 = "Horario de Inicio y cierre";
  } else if (dataType === "Operadores") {
    column1 = "Nombre y Apellido";
    column2 = "Mail";
    column3 = "Sucursal";
    column4 = "DNI";
  } else if (dataType === "Reservas") {
    column1 = "N° reserva";
    column2 = "Sucursal";
    column3 = "Fecha y hora";
    column4 = "Teléfono";
  } else if (dataType === "OperatorReservas") {
    column1 = "Usuario";
    column2 = "N° reserva";
    column3 = "Fecha y hora";
    column4 = "Sucursal";
  }
  //puede ser operadores, sucursales o historial de reservas.
  // funcion confirmacion de reserva de parte del operador 

  const handleConfirmedAssistence = (id, e)=>{
    const button = document.getElementById(`${id}`)
    axios.put(`http://localhost:3001/api/appointments/attended/${id}`)
    .then(()=>{ 
      alert("asistencia confirmada")
   
    })
    .catch(()=>alert("no fue posible confirmar la asistencia"))
    console.log("evento y id =>", id, e)
    button.disabled = true   
    button.innerText = "confirmado!"
    button.onClick = null
  }
  return (
    <>
      <div className={s.container} style={{ marginTop: "1.5%" }}>
        <h1>{dataType === "OperatorReservas" ? "Reservas" : dataType}</h1>
        <div className={s.table}>
          {data.map((objIns, i) => {
            return (
              objIns[objKeys[0]] != "" && (
                <div className={s.row} key={i}>
                  <div className={s.rowItem}>
                    <p>{column1}</p>
                    <b>{objIns[objKeys[0]]}</b>
                    {dataType === "Sucursales" && !objIns[objKeys[5]] && (
                      <p style={{ color: red[500] }}>(Sin operador)</p>
                    )}
                  </div>
                  <div className={s.rowItem}>
                    <p>{column2}</p>
                    <b>{objIns[objKeys[1]]}</b>
                  </div>
                  <div className={s.rowItem}>
                    <p>{column3}</p>

                    {dataType.includes("Reservas") ? (
                      <b>
                        <>{objIns[objKeys[2]].split("T")[0]} </>
                        &nbsp; · &nbsp;
                        <>{objIns[objKeys[4]].slice(0, 5)}hs</>
                      </b>
                    ) : objIns[objKeys[2]] == "Sin asignar" ? (
                      <b style={{ color: red[500] }}>Sin asignar</b>
                    ) : (
                      <b>{objIns[objKeys[2]]}</b>
                    )}
                  </div>
                  <div className={s.rowItem}>
                    <p>{column4}</p>
                    <b>{objIns[objKeys[3]]}</b>
                  </div>
                  <div className={s.rowItem}>
                    {datatype === "Operadores" && (
                      <div className="horiz">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(
                              `/admin/edit/operador/${objIns[objKeys[3]]}`
                            );
                          }}
                          variant="contained"
                          style={{
                            backgroundColor: "#F5F5F5",
                            color: "#A442F1",
                            textTransform: "none",
                            padding: "0 !important",
                          }}
                        >
                          Editar
                        </Button>
                        &nbsp; &nbsp;
                        <Button
                          onClick={(event) =>
                            handleOnClickDeleteOperator(
                              objIns[objKeys[4]],
                              event
                            )
                          }
                          variant="contained"
                          style={{
                            backgroundColor: red[500],
                            color: "white",
                            textTransform: "none",
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    )}
                    {datatype === "Sucursales" && (
                      <div className="horiz">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(
                              `/admin/edit/branch/${objIns[objKeys[4]]}`
                            ); //recibe adicion almente el id de la sucursal
                          }}
                          variant="contained"
                          style={{
                            backgroundColor: "#F5F5F5",
                            color: "#A442F1",
                            textTransform: "none",
                            padding: "0 !important",
                          }}
                        >
                          Editar
                        </Button>
                        &nbsp; &nbsp;
                        <Button
                          onClick={(event) =>
                            handleOnClickDeleteBranch(objIns[objKeys[4]], event)
                          }
                          variant="contained"
                          style={{
                            backgroundColor: red[500],
                            color: "white",
                            textTransform: "none",
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    )}
                    {dataType === "OperatorReservas" && (
                      <Button
                        id={`${objIns[objKeys[1]]}`}
                        variant="contained"
                        style={{
                          backgroundColor: "#F5F5F5",
                          color: "#A442F1",
                          textTransform: "none",
                          padding: "0 !important",
                        }}
                        onClick={
                          (event) =>
                          handleConfirmedAssistence(
                             objIns[objKeys[1]],
                              event
                            )
                        }
                      >
                        Confirmar
                      </Button>
                    )}

                    {dataType === "Reservas" && (
                      <div className="horiz">
                        <Button
                          onClick={(event) =>
                            handleOnClickEdit(objIns[objKeys[0]], event)
                          }
                          variant="contained"
                          style={{
                            backgroundColor: "#F5F5F5",
                            color: "#A442F1",
                            textTransform: "none",
                            padding: "0 !important",
                          }}
                        >
                          Editar
                        </Button>
                        &nbsp; &nbsp;
                        <Button
                          onClick={(event) =>
                            handleOnClickCancel(objIns[objKeys[0]], event)
                          }
                          variant="contained"
                          style={{
                            backgroundColor: red[500],
                            color: "white",
                            textTransform: "none",
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};
