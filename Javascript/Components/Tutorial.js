import React, { useState } from 'react';
import { ListGroup,ListGroupItem,TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col,CardBody } from 'reactstrap';
import classnames from 'classnames';
const Tutorial = (props) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return (
        <div>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                        For sorters
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                    >
                        Accounts
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '3' })}
                        onClick={() => { toggle('3'); }}
                    >
                        Data and schema
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <Card body>
                        <CardTitle>For sorters</CardTitle>
                        <CardBody>
                    <ListGroup>
                        <ListGroupItem>1. Select the company you want to search in the sort tab. You can search the drop down.</ListGroupItem>
                        <ListGroupItem>2. Select the relevant topic from the new topic drop down.</ListGroupItem>
                        <ListGroupItem>3. For each of the new attribute drop downs, select all of the options that you would be happy with.</ListGroupItem>
                        <ListGroupItem>4. For soft minimums (if any) enter the minimum value you would be 100% happy with for that attribute.</ListGroupItem>
                        <ListGroupItem>5. For soft maximums (if any) enter the maximum value you would be 100% happy with for that attribute.</ListGroupItem>
                        <ListGroupItem>6. For harshness, enter how intolerant you are of values outside your range. 1 means very tolerant, 10 means very intolerant.</ListGroupItem>
                        <ListGroupItem>7. For skew, for a value outside your minimum to maximum range, do you prefer it to be above or below?</ListGroupItem>
                        <ListGroupItem>8. For every attribute's weight, enter how much you care about that attribute. For example, 1.5 means 150%, 1 means 100%, and 0.5 means 50%.  This allows you to select preferences that don't make or break your final recommendations but are 'nice to haves'. Weight is optional!</ListGroupItem>
                        <ListGroupItem>9. For results wanted, enter the number of top results you want to see, for example 10 to see the 10 closest matches.</ListGroupItem>
                        <ListGroupItem>10. Click go to get your results, and click on any of the results to see more details!</ListGroupItem>
                    </ListGroup>
                        </CardBody>
                    </Card>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                            <Card body>
                                <CardTitle>Accounts</CardTitle>
                                <CardBody>
                                    <ListGroup>
                                        <ListGroupItem>1. You need an upload key to upload any data.</ListGroupItem>
                                        <ListGroupItem>2. Create an account under get your upload key.</ListGroupItem>
                                        <ListGroupItem>3. Save this upload key somewhere, you can change it or get it again at any time.</ListGroupItem>
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="3">
                    <Card body>
                        <CardTitle>Data uploads</CardTitle>
                        <CardBody>
                            <ListGroup>
                                <ListGroupItem>1. Data needs a specific format, an entered title, and a valid user key to be uploaded.</ListGroupItem>
                                <ListGroupItem>2. It may either be a simple list of data, or a standard .csv with the first row being column names.</ListGroupItem>
                                <ListGroupItem>3. Column 1 must be an ID, column 2 must be a product name.</ListGroupItem>
                                <ListGroupItem>4. Any numerical columns must have an &lt;M> wherever you give the column name, but not after every numerical data element.</ListGroupItem>
                                <ListGroupItem>5. All rows must have the same number of entries.</ListGroupItem>
                                <ListGroupItem>6. Data can either match your own schema, or a general schema, visible by clicking 'this is general schema' in data upload.</ListGroupItem>
                                <ListGroupItem>7. You can make schema yourself, or have the system generate it automatically.</ListGroupItem>
                                <ListGroupItem>8. If you choose autogeneration of schema, if the data does not have column names you will be prompted to enter them yourself.</ListGroupItem>
                                <ListGroupItem>9. If it does have column names in the text file, click that it does, and then submit.  This will replace all data with this same title.</ListGroupItem>
                            </ListGroup>
                            <p>Example data without column names:</p>
                            <p>0,Toyota Camry,Sedan,Japan,146,31,25555,Blue</p>
                            <p>1,Chevrolet Equinox,Compact SUV,USA,185,25,19599,Silver</p>
                            <p>2,Lamborghini Countach,Sports,Italy,575,13,150000,Red</p>
                            <p>etc...</p><br/><br/>
                            <p>Example data with column names:</p>
                            <p>ID,Name,Body type,Manufacturer location,Horsepower&lt;M>,MPG&lt;M>,Price&lt;M>,Color</p>
                            <p>0,Toyota Camry,Sedan,Japan,146,31,25555,Blue</p>
                            <p>1,Chevrolet Equinox,Compact SUV,USA,185,25,19599,Silver</p>
                            <p>2,Lamborghina Countach,Sports,Italy,575,13,150000,Red</p>
                            <p>etc...</p><br/><br/>
                        </CardBody>
                    </Card>
                    <Card body>
                        <CardTitle>Schema generation</CardTitle>
                        <CardBody>
                        <ListGroup>
                            <ListGroupItem>1. Schemas need a title and a user key to be uploaded.</ListGroupItem>
                            <ListGroupItem>2. Fill in attribute names with the title of the relevant attribute, ie. Color. You don't need &lt;M> tags here.</ListGroupItem>
                            <ListGroupItem>3. Click SWAP to switch between numerical attributes and select attributes.</ListGroupItem>
                            <ListGroupItem>4. For select attributes, type the title in the Type box and each option in a New option box, adding new options with the + right below it.</ListGroupItem>
                            <ListGroupItem>5. Numerical options just need a title.</ListGroupItem>
                            <ListGroupItem>6. Delete options or attributes with their respective x buttons.</ListGroupItem>
                            <ListGroupItem>7. Add a new attribute with the bottom + button.</ListGroupItem>
                            <ListGroupItem>8. Press submit to add this schema to your schema, replacing all schema with this title.</ListGroupItem>
                        </ListGroup>
                        </CardBody>
                    </Card>
                </TabPane>
            </TabContent>
        </div>
    );
}

export default Tutorial;
