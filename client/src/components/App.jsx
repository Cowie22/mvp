import React from 'react';
import axios from 'axios';
import ImageMapper from 'react-image-mapper';
import Display from './Display.jsx';
import FavoriteDisplay from './FavoriteDisplay.jsx';
import ToCompleteDisplay from './ToCompleteDisplay.jsx';
import RunsDisplay from './RunsDisplay.jsx';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runInfo: [],
      oneRunInfo: [],
      currentRuns: [],
      id: 0,
      name: '',
      terrain: '',
      status: '',
      is_favorite: 0,
      to_complete: 0,
      vertical_feet: 0,
    };
    this.getRuns = this.getRuns.bind(this);
    this.updateRun = this.updateRun.bind(this);
    this.updateComplete = this.updateComplete.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }

  componentDidMount() {
    this.getRuns();
    this.getVerticalFeet();
  }

  getRuns() {
    axios.get(`/run`)
      .then(res => {
        this.setState({
          runInfo: res.data,
        });
      })
  }

  getVerticalFeet() {
    let total = 0
    axios.get(`/vertical`)
      .then(res => {
        for (let i = 0; i < res.data.length; i++) {
          total += res.data[i].vertical_feet
          this.setState({
            vertical_feet: total
          })
        }
      })
  }

  getOneRun(id) {
    axios.get(`/run/${id}`)
      .then(res => {
        this.setState({
          oneRunInfo: res.data,
          id: res.data[0].id,
          name: res.data[0].name,
          terrain: res.data[0].terrain,
          status: res.data[0].status === 1 ? 'OPEN' : 'CLOSED',
          is_favorite: res.data[0].is_favorite,
          to_complete: res.data[0].to_complete,
        });
      });
  }

  updateRun(info, id) {
    axios.put(`/run/${id}`, info)
      .then(this.getOneRun(id))
      .then(this.getRuns())
      .then(this.getVerticalFeet());
  }

  updateComplete(info, id) {
    axios.put(`/toComplete/${id}`, info)
      .then(this.getOneRun(id))
      .then(this.getRuns());
  }

  updateStatus(info, id) {
    axios.put(`/runStatus/${id}`, info)
      .then(this.getOneRun(id))
      .then(this.getRuns());
  }

  clickedOutside() {
		this.setState({
      id: 0,
    });
  }

  enterChairLift(lift_id) {
    if (lift_id > 0) {
      axios.get(`/runs/${lift_id}`)
        .then(res => {
          this.setState({
            currentRuns: res.data,
          });
        });
    }
  }

  render() {
    const URL = 'http://www.accommodationtahoe.com/assets/images/autogen/a_north.gif';
    const MAP = {
      name: 'my-map',
      areas: [
        {name: 'Martis', id: 1, shape: 'poly', coords: [532, 330, 491, 360, 474, 393, 466, 413, 440, 437, 422, 450, 429, 460, 429, 458, 434, 499, 457, 534, 464, 561, 495, 564, 493, 553, 451, 494, 455, 471, 443, 446, 443, 447, 468, 424, 484, 396, 496, 378, 522, 353, 534, 346], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Boca', id: 2, shape: 'poly', coords: [536, 347, 528, 383, 536, 403, 538, 440, 525, 467, 518, 477, 518, 491, 516, 505, 541, 572, 566, 574, 562, 561, 546, 548, 536, 502, 539, 490, 551, 436, 553, 413, 540, 390, 538, 379, 543, 366, 543, 344], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Gooseneck', id: 3, shape: 'poly', coords: [546, 341, 555, 404, 569, 439, 584, 525, 579, 525, 586, 577, 604, 578, 593, 514, 580, 459, 573, 419, 576, 414, 570, 408, 559, 345], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Stampede', id: 4, shape: 'poly', coords: [589, 365, 593, 382, 604, 390, 605, 414, 608, 422, 603, 456, 604, 482, 593, 517, 601, 556, 616, 504, 623, 474, 621, 456, 620, 434, 615, 409, 612, 391], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Prosser', id: 5, shape: 'poly', coords: [552, 339, 576, 357, 591, 366, 613, 391, 630, 405, 632, 418, 639, 418, 640, 432, 654, 444, 659, 461, 662, 480, 660, 497, 657, 513, 652, 528, 640, 546, 631, 559, 622, 566, 602, 568, 604, 582, 634, 583, 635, 565, 654, 549, 669, 531, 677, 517, 678, 501, 684, 490, 683, 471, 675, 455, 667, 439, 651, 423, 609, 367, 590, 350, 564, 332, 546, 329], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Lookout', lift_id: 1, shape: 'poly', coords: [557, 436, 570, 522, 584, 522, 569, 434], fillColor: 'rgb(170, 17, 17, 0.8)'},
        {name: 'Promised Land', id: 6, shape: 'poly', coords: [488, 225, 496, 250, 501, 264, 505, 276, 508, 285, 523, 293, 543, 299, 560, 299, 563, 286, 535, 282, 524, 268, 520, 263, 522, 258, 522, 248, 514, 232, 513, 228, 507, 227, 497, 213], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Iron Horse', id: 7, shape: 'poly', coords: [503, 197, 518, 206, 525, 217, 533, 231, 541, 249, 553, 271, 563, 290, 586, 298, 586, 289, 578, 283, 571, 272, 566, 262, 558, 250, 555, 241, 547, 228, 539, 224, 533, 214, 525, 200, 516, 193, 507, 177], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Polaris', id: 8, shape: 'poly', coords: [509, 161, 526, 171, 538, 182, 548, 197, 558, 210, 568, 220, 574, 229, 582, 258, 598, 277, 610, 288, 611, 297, 628, 295, 620, 287, 618, 279, 603, 266, 597, 261, 593, 241, 585, 222, 573, 211, 562, 198, 556, 192, 551, 180, 536, 167, 526, 157, 517, 152, 509, 145], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'The Rapids', id: 9, shape: 'poly', coords: [503, 98, 518, 112, 551, 152, 552, 155, 554, 163, 584, 202, 590, 205, 589, 209, 595, 214, 615, 246, 619, 246, 623, 250, 625, 258, 630, 259, 653, 296, 668, 296, 658, 279, 642, 261, 641, 251, 604, 205, 556, 144, 523, 97], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Burn Out', id: 10, shape: 'poly', coords: [525, 96, 554, 125, 560, 130, 578, 152, 585, 155, 591, 161, 628, 197, 644, 211, 647, 213, 654, 229, 686, 263, 688, 270, 692, 269, 703, 291, 719, 290, 705, 269, 707, 265, 701, 263, 702, 256, 694, 253, 679, 239, 673, 232, 673, 224, 654, 209, 653, 202, 637, 188, 628, 176, 600, 157, 592, 150, 582, 135, 543, 98], fillColor: 'rgb(255, 209, 0, 0.8)'},
        {name: 'Rail Splitter', id: 11, shape: 'poly', coords: [590, 105, 616, 120, 620, 125, 621, 131, 623, 153, 656, 178, 690, 210, 720, 239, 734, 257, 744, 272, 747, 272, 746, 285, 763, 280, 759, 273, 748, 256, 738, 241, 735, 239, 735, 232, 714, 213, 703, 209, 689, 190, 671, 174, 666, 169, 642, 154, 634, 146, 632, 142, 635, 134, 634, 120], fillColor: 'rgb(255, 209, 0, 0.8)'},
      ]
    };
    return (
      <div>
        <span className="header">
          <h1>N-STAR</h1>
          <h1>{this.state.vertical_feet} Vertical Feet</h1>
        </span>
        <div className="image_container">
          <ImageMapper className="N-Star"
          src={URL}
          map={MAP}
          width={900}
          height={700}
          onClick={area => this.getOneRun(area.id)}
          onImageClick={() => this.clickedOutside()}
          onMouseEnter={area => this.enterChairLift(area.lift_id)}
          />
        </div>
        <Display
        info={this.state}
        updateRun={this.updateRun}
        updateComplete={this.updateComplete}
        updateStatus={this.updateStatus}
        />
        <FavoriteDisplay
        info={this.state.runInfo}
        />
        <ToCompleteDisplay
        info={this.state.runInfo}
        />
        <RunsDisplay
        info={this.state.currentRuns}
        />
      </div>
    )
  }
}

export default App;