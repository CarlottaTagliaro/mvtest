if(_debug == undefined){
  const _debug = true;
}else if(_debug){
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

//The view that gives access to the db
//working with the classes
//the proposed functions are get, edit, and delete
function class_v(_db){
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
  self.getById = _id => {
    typecheck(_id, 0);
    return new Promise((res, rej)=>{
      self.db.query(GET_CLASS_BY_ID_QUERY, [_id] )
      .then( _r =>{
        res(_r.rows[0]);
      }).catch( _e =>{
        log(_e);
        rej(_e);
      });
    });
  };
  self.create = _name => {
    typecheck(_name, "");
    return new Promise((res, rej)=>{
      self.db.query(CREATE_CLASS_QUERY, [_name])
      .then( _res =>{
        res(_res);
      }).catch( _err => {
        log(_err);
        rej(_err);
      });
    })
  };
  self.edit = (_id, _name, _new_name) => {
    typecheck(_id, 0); 
    typecheck(name, "");
    return new Promise((res, rej)=>{
      self.db.query(EDIT_CLASS_QUERY, [_id, _new_name])
      .then( _res => {
        res(_res);
      }).catch( _err => {
        log(_err);
        rej(_err);
      });
    });
  };
  self.delete = _id => {
    typecheck(_id, 0);
    return new Promise((res, rej)=>{
      self.db.query(DELETE_CLASS_QUERY, [_id])
      .then( _res => {
        res(_res);
      }).catch( _err => {
        log(_err);
        rej(_err);
      });
    });
  }
}
