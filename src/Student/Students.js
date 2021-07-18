import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input} from 'reactstrap';
import ReactPaginate from 'react-paginate';
import './Student.css';
import axios from "axios";
import {useState ,useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const {Table} = require("reactstrap");
function Student(){
    let [classDetails, setclassesData] =  useState('');
    let [campusDetails, setcampusData] =  useState('');
   
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
   

    const [offset, setOffset] = useState(0);
    const [alldata, setData] = useState([]);
    const [perPage] = useState(9);
    const [pageCount, setPageCount] = useState(0)
    
    let [first_name, setfirst_name] =  useState("");
    let [last_name, setlast_name] =  useState("");
    let [email, setemail] =  useState("");
    let [mobile_number, setmobile_number] =  useState("");
    let [campus, setcampus] =  useState(['']);
    let [class_name, setclass] =  useState([]);
    let [section, setsection] =  useState([]);
    let [id, setId] =  useState("");
    let [gender, setgender] =  useState("");
    let [student_id, setstudentid] =  useState([]);

    let [dob, setDob] = useState(new Date());

    const loadData = async() => {
      const res = await axios.get(`https://mtml-api.hestawork.com/api/user/`)
      const data = res.data.rows;
      //console.log(data);
                const slice = data.slice(offset, offset + perPage)
                const postData = slice.map(stud => <tr key = {stud._id}>
                  <td>{stud._id}</td>
                  <td>{stud.first_name}</td>
                  <td>{stud.last_name}</td>
                  <td>{stud.email}</td>
                  <td>{stud.mobile_number}</td>
                  <td>{stud.campus}</td>
                  <td><Button color="success" onClick = {() => { getstudent(stud._id); }}><i className="fa fa-pencil" ></i></Button></td>
              </tr>)
                setData(postData)
                setPageCount(Math.ceil(data.length / perPage))
  }
      const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage + 1)
    };

    const campusData = () => {
        axios.get("https://mtml-api.hestawork.com/api/userClass/class-details").then(response =>{
           //console.log(response.data.data.classes);
           setcampusData(response.data.data.campus);
           setclassesData(response.data.data.classes);
           
        });
      
       }
       useEffect(() => {
        loadData()
      }, [offset])

      useEffect(() => {
        campusData()
      }, [])

      const handleChange = (e) => console.log((campus[e.target.value]));

   function addRecord(){
    axios.post("https://mtml-api.hestawork.com/api/user/filter-students/", {
      "first_name":first_name,
        "last_name": last_name,
        "campus":campus,
        "user_id" : id,
        "student_id":student_id,
        "dob":dob,
        "gender":gender,
        "email":email,
        "mobile_number":mobile_number,
        "class_name":class_name,
        "section":section
  }).then(response => {
      //console.log(response);
      toast("success");
      loadData();
  }).catch(err => console.log(err));
   }

   function updateRecord(){
    axios.put("https://mtml-api.hestawork.com/api/user/update-student", {
        "first_name":first_name,
        "last_name": last_name,
        "campus":campus,
        "user_id" : id,
        "student_id":student_id,
        "dob":dob,
        "gender":gender,
        "email":email,
        "mobile_number":mobile_number,
        "class_name":class_name,
        "section":section
        
    }).then(response => {
      toast("success");
        document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
        loadData();
        
    })
}


   function getstudent(id) {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    axios.get("https://mtml-api.hestawork.com/api/user/"+id).then(res => {
      let stud = res.data;
      console.log(stud.student);
      setmobile_number(stud.mobile_number);
      setfirst_name(stud.first_name);
      setlast_name(stud.last_name);
      setemail(stud.email);
      setId(stud._id);
      setcampus(stud.campus);
      setstudentid(stud.student.student_id);
      setgender(stud.student.gender);
      setDob(stud.student.dob);
      setsection(stud.student.section);
      setclass(stud.student.class_name)
     
  })


  }
  
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }

  function getclassval(){
    
  }

    return (
    <div>
      <div id="mySidebar" class="sidebar">
       
            <Form>
            <Input type="hidden" name="id"  placeholder="First Name" value={id}
                     onChange = { event => {setId(event.target.value)}} />
              <FormGroup>
                  <Label >Email</Label>
                  <Input type="email" name="email"  placeholder="Enter email" value={email}
                 onChange = { event => {setemail(event.target.value)}} readOnly/>
              </FormGroup>

              <FormGroup>
                <Label >First Name</Label>
                <Input type="text" name="first_name"  placeholder="First Name" value={first_name}
                     onChange = { event => {setfirst_name(event.target.value)}} />
              </FormGroup>
              <FormGroup>
                <Label >Last Name</Label>
                <Input type="text" name="last_name"  placeholder="Last Name" value={last_name}
                 onChange = { event => {setlast_name(event.target.value)}}/>
              </FormGroup>
              <FormGroup>
                <Label >Mobile number</Label>
                <Input type="text" name="mobile_number"  placeholder="Mobile" value={mobile_number} onChange = { event => {setmobile_number(event.target.value)}} />
              </FormGroup>
              
              <FormGroup>
                <Label >DOB</Label>
                <input type="date" id="dob" name="dob"  value={dob} onChange = { event => {setDob(event.target.value)}}></input>
              
              </FormGroup>
              <FormGroup>
                    <Label >Student ID</Label>
                    <Input type="text" name="student_id[]" value={student_id} placeholder="Student id" onChange = { event => {setstudentid(event.target.value)}}/>
                  </FormGroup>
              <FormGroup>
                <Label >Campus</Label>
                <Input type="select" name="campus" onChange = { event => {setcampus(event.target.value)}}>
                    
                    {campusDetails && campusDetails.map( campus => 
                      <option  value={campus.campus_name}>{campus.campus_name}</option>
                      
                      )}
                  
                  </Input>
              
              </FormGroup>

              <FormGroup>
                    <Label >Class</Label>
                    <Input type="select" name="class" onChange = {() => {getclassval();}}>
                    
                      {classDetails && classDetails.map( cls => 
                        <option value={cls.class_name}>{cls.class_name}</option>
                        
                        )}
                    
                    </Input>
                  
                  </FormGroup>


                  
              <FormGroup>
                    <Label>Section</Label>
                    <Input type="select" name="section" onChange = { event => {setclass(event.target.value)}}>
                    
                     <option value="A">A</option>
                     <option value="B">B</option>
                     <option value="C">C</option>
                     <option value="D">D</option>
                     <option value="E">E</option>
                  
                    </Input>
                  
                  </FormGroup>

                  <FormGroup tag="fieldset">
                   Gender
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="gender" checked={gender === 'MALE'} value="MALE" onClick={() => setgender('Male')}  />
                    Male
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="gender" checked={gender === 'FEMALE'} value="FEMALE" onClick={() => setgender('Female')}/>
                      Female
                      </Label>
                    </FormGroup>
                  
                  </FormGroup>

                  

              <Button color="primary" onClick = {() => {updateRecord();}}>Save</Button>
              <Button color="danger" onClick = {() => {closeNav(); }}>Cancel</Button>
            </Form>
      </div>
      <div id="main">
        <Button color="danger" onClick={toggle}>Add Students</Button>
          <Modal isOpen={modal} toggle={toggle} className=''>
            <ModalHeader toggle={toggle}>Student Information</ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                      <Label >Email</Label>
                      <Input type="email" name="email"  placeholder="Enter email"  onChange = { event => {setemail(event.target.value)}} />
                  </FormGroup>
                  <FormGroup>
                    <Label >First Name</Label>
                    <Input type="text" name="first_name"  placeholder="First Name"  onChange = { event => {setfirst_name(event.target.value)}} />
                  </FormGroup>
                  <FormGroup>
                    <Label >Last Name</Label>
                    <Input type="text" name="last_name"  placeholder="Last Name"  onChange = { event => {setlast_name(event.target.value)}} />
                  </FormGroup>
                  <FormGroup>
                    <Label >Mobile number</Label>
                    <Input type="text" name="mobile_number"  placeholder="Mobile" onChange = { event => {setmobile_number(event.target.value)}}/>
                  </FormGroup>
                  <FormGroup>
                <Label >DOB</Label>
                <input type="date" id="dob" name="dob"  onChange = { event => {setDob(event.target.value)}}></input>
              
              </FormGroup>
                  <FormGroup>
                    <Label >Student ID</Label>
                    <Input type="text" name="student_id[]"  placeholder="Student id" onChange = { event => {setstudentid(event.target.value)}}/>
                  </FormGroup>
                  <FormGroup>
                    <Label >Campus</Label>
                    <Input type="select" name="campus" onChange={e => handleChange(e)}>
                    
                      {campusDetails && campusDetails.map( campus => 
                        <option value={campus.campus_name}>{campus.campus_name}</option>
                        
                        )}
                    
                    </Input>
                  
                  </FormGroup>
                  <FormGroup>
                    <Label >Class</Label>
                    <Input type="select" name="campus" onChange={e => handleChange(e)}>
                    
                      {classDetails && classDetails.map( cls => 
                        <option value={cls.class_name}>{cls.class_name}</option>
                        
                        )}
                    
                    </Input>
                  
                  </FormGroup>
                  <FormGroup>
                    <Label>Section</Label>
                    <Input type="select" name="section" onChange = { event => {setclass(event.target.value)}}>
                    
                     <option value="A">A</option>
                     <option value="B">B</option>
                     <option value="C">C</option>
                     <option value="D">D</option>
                     <option value="E">E</option>
                  
                    </Input>
                  
                  </FormGroup>

                  <FormGroup tag="fieldset">
                   Gender
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="gender" onChange = { event => {setgender(event.target.value)}} />
                    Male
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="gender" onChange = { event => {setgender(event.target.value)}}/>
                      Female
                      </Label>
                    </FormGroup>
                  
                  </FormGroup>

                  <Button color="primary" onClick = {() => {addRecord();}}  toggle={toggle} >Save</Button>  <Button color="secondary" onClick={toggle}>Cancel</Button>
                </Form>
                <ToastContainer ></ToastContainer>
              </ModalBody>
            <ModalFooter>
            
            </ModalFooter>
          </Modal>
        <Table striped>
            <thead>
              <tr>
                <th>Student id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Emailid </th>
                <th>Mobile number </th>
                <th>Campus </th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
            {alldata}
            </tbody>
    
        </Table>
        <ReactPaginate
                  
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>
      </div>
     
    </div>
    ); 
}

export default Student;