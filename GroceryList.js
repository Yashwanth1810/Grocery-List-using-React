import { Component } from "react";
import bag from './bag.png'
import jsPDF from 'jspdf';

export class GroceryList extends Component {
    state = {
        userInput: "",
        groceryList: [],
        user: "",
        date: new Date().toISOString().split('T')[0]
    }

    componentDidMount() {
        this.fetchGroceryLists();
    }

    async fetchGroceryLists() {
        try {
            const response = await fetch('http://localhost:5000/api/grocery-lists');
            const data = await response.json();
            this.setState({ listHistory: data });
        } catch (error) {
            console.error('Error fetching grocery lists:', error);
        }
    }

    onChangeEvent(e) {
        this.setState({userInput: e});
    }

    addItem(input) {
        if(input === '') {
            alert ("Please enter an item");
        } else {
            let listArray = this.state.groceryList;
            listArray.push(input);
            this.setState({ groceryList: listArray, userInput: '' });
        }
    }

    deleteItem() {
        this.setState({groceryList: []});
    }

    crossedword(event) {
        const li = event.target;
        li.classList.toggle("crossed");
    }

    onFormSubmit(e) {
        e.preventDefault();
    }

    saveList = () => {
        const { groceryList } = this.state;
        if (groceryList.length === 0) {
            alert("No items to save!");
            return;
        }
        localStorage.setItem('savedGroceryList', JSON.stringify(groceryList));
        alert("List saved!");
    };

    downloadList = () => {
        let groceryList = this.state.groceryList;
        let date = this.state.date || new Date().toISOString().split('T')[0];
        if (groceryList.length === 0) {
            // Try to get from localStorage if not in state
            const saved = localStorage.getItem('savedGroceryList');
            if (saved) {
                groceryList = JSON.parse(saved);
            }
        }
        if (!groceryList || groceryList.length === 0) {
            alert("No items to download!");
            return;
        }
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Grocery List (${date})`, 10, 15);
        let y = 30;
        groceryList.forEach((item, index) => {
            doc.setFontSize(14);
            doc.text(`${index + 1}. ${item}`, 10, y);
            y += 10;
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
        doc.save(`grocery-list-${date}.pdf`);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <div className="container">
                        <input
                            type="date"
                            value={this.state.date}
                            onChange={e => this.setState({ date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="container">
                        <input type="text"
                        placeholder="What do you want to buy today?"
                        onChange={(e) => {this.onChangeEvent(e.target.value)}}
                        value={this.state.userInput} />
                    </div>
                    <div className="container">
                        <button onClick={() => this.addItem(this.state.userInput)} className="btn add">Add</button>
                        <button type="button" onClick={this.saveList} className="btn save">Save</button>
                        <button type="button" onClick={this.downloadList} className="btn download">Download</button>
                    </div>
                    <ul> 
                        {this.state.groceryList.map((item, index) => (
                            <li onClick={this.crossedword} key={index}>
                                <img src={bag} className="bag" alt="bag" />
                                {item}</li>
                        ))} 
                    </ul>
                    <div className="container">
                        <button onClick={() => this.deleteItem()} className="btn delete">Delete</button>
                    </div>
                </form>
            </div>
        )
    }
}