const Usuario = require("../models/usuario");
const status = require("http-status");
const { fetchPaginatedData, defaultErrorHandler, cloneObject } = require("../utils");
const { Op } = require("sequelize");
const Empresa = require("../models/empresa");
const Cupao = require("../models/cupao");
const Activador = require("../models/activador");


exports.Insert = (req, res) => {
  const cup = req.body;
  cup.validacoes=0;
  cup.pagamento=0;
  
  const codigo = generateCode();
  const cupao = Cupao.findOne({ where: { codigo: codigo} })
    .then((cupao) => {
      if (cupao) {
        exports.Insert(req,res);
      } else {
        cup.codigo=codigo;
        Cupao.create(cup)
          .then((cup) => {
            if (cup) {
              res.status(status.OK).send(cup);
            } else {
              res.status(status.NOT_FOUND).send();
            }
          })
          .catch((error) => defaultErrorHandler(res, error));
              
            }
          })
    .catch((error) => defaultErrorHandler(res, error));
};



exports.validate = (req, res) => {
    const codigo = req.params.codigo;
    let { quantidade, validacoes } = req.body
    const cupao = Cupao.findOne({ where: { codigo: codigo} })
      .then((cupao) => {
        if (cupao) {
          if(cupao.quantidade>0){
            quantidade =cupao.quantidade-1;
            validacoes =cupao.validacoes+1;
            cupao
            .update(cloneObject({ quantidade, validacoes }), {
              where: { codigo },
            })
            .then(() => {
                res.status(status.OK).send(cupao);
            })
            .catch((error) => defaultErrorHandler(res, error));
          } else{
              res.send("cupao esgotado");
          }

        } else {
          res.status(status.NOT_FOUND).send();
        }
      })
      .catch((error) => defaultErrorHandler(res, error));
  };

 //metodo que gera cupoes
 function generateCode(){
    const max = 1000
    const min= 100
    const resultado = Math.random()*(max - min) + min
    const numero = Math.floor(resultado);
    const codigo = ("RJ"+numero);
    return codigo;
  };

  exports.SearchAll = (req, res) => {
    const { nome, quantidade, validacoes} = req.query;
  
    const where = {}
    const activadorWhere = {}
    // if (req.user.funcao === 'vendedor') {
    //   where.usuarioId = req.user.id
    // }
    if (quantidade) {
      where.quantidade = quantidade
    }
    if (validacoes) {
      where.validacoes = validacoes
    }
    include = [{ model: Usuario,attributes:{exclude: ['senha']} }, 
   
    {model: Cupao,where: activadorWhere}, ]
    fetchPaginatedData(req, res, Activador,where, undefined, include)
  
  };
  //Metodo para indicar o pagamento;
  exports.update = (req, res) => {
    const id = req.params.id;
    let { pagamento} = req.body
  
    Cupao.findByPk(id)
      .then((cupao) => {
        if (cupao) {
            pagamento = 1;
            if(cupao.quantidade==0){
          cupao
            .update(cloneObject({ pagamento}), {
              where: { id },
            })
            .then(() => {
              res.status(status.OK).send();
            })
            .catch((error) => defaultErrorHandler(res, error));
          } else{
            res.status(status.METHOD_NOT_ALLOWED).send();
          }
        } else {
          res.status(status.NOT_FOUND).send();
        }
      })
      .catch((error) => defaultErrorHandler(res, error));
  };
