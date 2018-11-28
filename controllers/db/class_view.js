if(this._debug == undefined){
  const _debug = true;
}else if(this._debug){
  log = console.log
}else{
  log = function(_){};
}

//returns true when a has the same value of a_std_value
//throws Error on assertion failed and returns false
function typecheck(a, a_std_value){
  if((typeof a ) === typeof(a_std_value)){
    return true;
  }
  throw new Error("Type assertion failed");
  return false; //consistency in returns, not of real value;
}
//checks wether the object has all props in prop
//throwin Error if obj is null or misses a prop
//or function needed
function not_null_having(obj, funcs, props){
  if(!obj){
    throw new Error("Object is null");
    return false;
  }
  if(!funcs){
    funcs = [];
  }
  if(!props){
    props = [];
  }
  for(f of funcs){
    if(!obj[f]){
      throw new Error("Function " + f + " is not defined");
      return false;
    }
    if(!typecheck(obj[f], function () {})){
      throw new Error("Property " + f + " is not a function");
      return false;
    }
  }
  for(p of props){
    if(!obj[p]){
      throw new Error("Property " + p + " is not defined");
      return false;
    }
  }
  return true;
}

//The view that gives access to the db
//working with the classes
//the proposed functions are get, edit, and delete
function class_v(_db){
  not_null_having(_db, ["query"], []);
  const GET_ALL_CLASSES_QUERY = "SELECT id, name FROM class;";
  const GET_CLASS_BY_ID_QUERY = "SELECT id, name FROM class WHERE id = $1;";
  const CREATE_CLASS_QUERY ="INSERT INTO class VALUE(id, name);";
  const EDIT_CLASS_QUERY = "UPDATE class SET name = $2 WHERE id = $1;";
  const DELETE_CLASS_QUERY = "DELETE FROM class WHERE id = %1";
  let self = this;
  self.db = _db;
  
  self.getAll = ()=>{
    return new Promise((res, rej) => {
      self.db.query(GET_ALL_CLASS_QUERY).then( _r => {
        res(_r.rows);
      }).catch( _e => {
        log(_e);        
        rej(_e);
      });
    });
  };
  self.getById = _c => {
    not_null_having(_c, [], ["id"]);
    typecheck(_c["id"], 0);
    return new Promise((res, rej)=>{
      self.db.query(GET_CLASS_BY_ID_QUERY, [_c.id] )
      .then( _r =>{
        res(_r.rows[0]);
      }).catch( _e =>{
        log(_e);
        rej(_e);
      });
    });
  };
  self.create = c => {
    not_null_having(_c, [], ["name"]);
    typecheck(c["name"], "");
    return new Promise((res, rej)=>{
      self.db.query(CREATE_CLASS_QUERY, [_c.name])
      .then( _res =>{
        res(_res);
      }).catch( _err => {
        log(_err);
        rej(_err);
      });
    })
  };
  self.edit = (_c) => {
    not_null_having(_c, [], ["id", "name"]);
    typecheck(_c["id"], 0); 
    typecheck(_c["name"], "");
    return new Promise((res, rej)=>{
      self.db.query(EDIT_CLASS_QUERY, [_c.id, _c.name])
      .then( _res => {
        res(_res);
      }).catch( _err => {
        log(_err);
        rej(_err);
      });
    });
  };
  self.delete = _c => {
    not_null_having(_c, [], ["id"]);
    typecheck(_c["id"], 0);
    return new Promise((res, rej)=>{
      self.db.query(DELETE_CLASS_QUERY, [_c.id])
      .then( _res => {
        res(_res);
      }).catch( _err => {
        log(_err);
        rej(_err);
      });
    });
  }
  self.getUsers = _c =>{
    not_null_having(_c, [],["id"]);
    typecheck(_c["id"], 0);
    return new Promise((res, rej) => {
      self.db.query(SELECT_USER_IN_CLASS_QUERY, [_c.id])
      .then( _res =>{
        res(_res);
      }).catch( _err =>{
        log(_err);
        rej(_err);
      });
    });
  }
}

module.exports = class_v;
