//returns true when a has the same value of a_std_value
//throws Error on assertion failed and returns false
function typecheck(a, a_std_value){
  if((typeof a ) === typeof(a_std_value)){
    return true;
  }
  throw new Error("Type assertion failed");
  return false; //consistency in returns, not of real value;
}

//The view that gives access to the db
//working with the classes
//the proposed functions are get, edit, and delete
function class_v(_db){
  typecheck((_db ? _db : {})["query"], function(){});
  const GET_ALL_CLASSES_QUERY = "SELECT id, name FROM class;";
  const GET_CLASS_BY_ID_QUERY = "SELECT id, name FROM class WHERE id = $1;";
  const CREATE_CLASS_QUERY ="INSERT INTO class(name) VALUES($1) RETURNING id;";
  const EDIT_CLASS_QUERY = "UPDATE class SET name = $2 WHERE id = $1;";
  const DELETE_CLASS_QUERY = "DELETE FROM class WHERE id = $1";
  let self = this;
  self.db = _db;
  
  self.getAll = ()=>{
    return new Promise((res, rej) => 
    self.db.query(GET_ALL_CLASSES_QUERY)
      .then( _r => res(_r.rows))
      .catch( _e => rej(_e))
    );
  };
  self.getById = _id => {
    typecheck(_id, 0);
    return new Promise((res, rej)=>{
      self.db.query(GET_CLASS_BY_ID_QUERY, [_id] )
      .then( _r => res(_r.rows[0]))
      .catch( _e => log(_e));
    });
  };
  self.create = _c => {
    typecheck(_c["name"], "");
    return new Promise((res, rej)=>{
      self.db.query(CREATE_CLASS_QUERY, [_c.name])
      .then( _res => res(_res.rows[0]))
      .catch( _err => rej(_err));
    })
  };
  self.edit = (_id, _c) => {
    typecheck(_id, 0); 
    typecheck(_c["name"], "");
    return new Promise((res, rej)=>{
      self.db.query(EDIT_CLASS_QUERY, [_id, _c.name])
      .then( _res => res(_res))
      .catch( _err => rej(_err));
    });
  };
  self.delete = _id => {
    typecheck(_id, 0);
    return new Promise((res, rej)=>{
      self.db.query(DELETE_CLASS_QUERY, [_id])
      .then( _res => res(undefined)).catch( _err => rej(_err));
    });
  }
}

module.exports = class_v;
