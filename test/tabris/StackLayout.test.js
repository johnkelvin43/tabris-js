import ClientStub from './ClientStub';
import {expect, mockTabris, restore, stub} from '../test';
import Composite from '../../src/tabris/widgets/Composite';
import StackComposite from '../../src/tabris/widgets/StackComposite';
import TextView from '../../src/tabris/widgets/TextView';
import StackLayout from '../../src/tabris/StackLayout';
import {LayoutQueue, ConstraintLayout} from '../../src/tabris/Layout';
import {toXML} from '../../src/tabris/Console';

describe('StackLayout', function() {

  /** @type {Composite} */
  let parent;

  /** @type {ClientStub} */
  let client;

  /** @type {LayoutQueue} */
  let queue;

  beforeEach(function() {
    client = new ClientStub();
    mockTabris(client);
    queue = new LayoutQueue();
  });

  afterEach(restore);

  describe('StackLayout.default', function() {

    it('has defaults', function() {
      expect(StackLayout.default.spacing).to.equal(0);
      expect(StackLayout.default.alignment).to.equal('left');
    });

  });

  describe('constructor', function() {

    it('sets defaults', function() {
      const layout = new StackLayout();

      expect(layout.spacing).to.equal(0);
      expect(layout.alignment).to.equal('left');
    });

    it('override defaults', function() {
      const layout = new StackLayout({spacing: 2, alignment: 'right'});

      expect(layout.spacing).to.equal(2);
      expect(layout.alignment).to.equal('right');
    });

  });

  describe('instance', function() {

    /** @type {TextView[]} */
    let children;

    /** @type {string[]} */
    let cid;

    function render(stackProps) {
      parent = new Composite({layout: new StackLayout(stackProps, queue)});
      parent.append(children);
      client.resetCalls();
      parent.layout.render(parent);
      tabris.trigger('flush');
      return parent.children().toArray().map(child => client.properties(child.cid).layoutData);
    }

    beforeEach(function() {
      children = [];
      for (let i = 0; i < 6; i++) {
        children.push(new TextView());
      }
      cid = children.map(child => child.cid);
    });

    describe('with alignment left', function() {

      it('renders children layoutData', function() {
        const all = render({alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, left: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 0], left: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 0], left: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 0], left: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 0], left: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 0], left: 0});
      });

      it('renders children layoutData with spacing', function() {
        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, left: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], left: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], left: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 16], left: 0});
      });

      it('renders children layoutData with dimension', function() {
        children[0].width = 100;
        children[1].height = 200;
        children[2].set({width: 300, height: 400});

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, left: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 0, height: 200});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], left: 0, width: 300, height: 400});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0});
      });

      it('renders children layoutData with alternate alignment', function() {
        children[0].width = 100;
        children[1].left = 10;
        children[2].right = 10;
        children[3].set({left: 0, right: 0});
        children[4].set({centerX: 10});

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, left: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 10});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], right: 10});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0, right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], centerX: 10});
      });

      it('normalizes invalid layoutData with warning', function() {
        stub(console, 'warn');
        children[0].set({baseline: children[1], width: 100});
        children[1].left = [children[0], 10];
        children[2].right = [children[0], 10];
        children[3].set({left: ['10%', 0], right: ['10%', 0], width: 0});
        children[4].set({centerX: 10, centerY: 10, left: 10});

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, left: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 10});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], right: 10});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0, right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], centerX: 10});
        expect(console.warn).to.have.been.called.callCount(8);
      });

    });

    describe('with alignment centerX', function() {

      it('renders children layoutData with spacing', function() {
        const all = render({spacing: 16, alignment: 'centerX'});
        const cid = parent.children().toArray().map(child => child.cid);

        expect(all[0]).to.deep.equal({top: 0, centerX: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], centerX: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], centerX: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], centerX: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], centerX: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 16], centerX: 0});
      });

      it('renders children layoutData with dimension', function() {
        children[0].width = 100;
        children[1].height = 200;
        children[2].set({width: 300, height: 400});

        const all = render({spacing: 16, alignment: 'centerX'});

        expect(all[0]).to.deep.equal({top: 0, centerX: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], centerX: 0, height: 200});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], centerX: 0, width: 300, height: 400});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], centerX: 0});
      });

      it('renders children layoutData with alternate alignment', function() {
        children[0].width = 100;
        children[1].left = 10;
        children[2].right = 10;
        children[3].set({left: 0, right: 0});
        children[4].set({centerX: 10});

        const all = render({spacing: 16, alignment: 'centerX'});

        expect(all[0]).to.deep.equal({top: 0, centerX: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 10});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], right: 10});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0, right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], centerX: 10});
      });

    });

    describe('with alignment stretchX', function() {

      it('renders children layoutData', function() {
        const all = render({alignment: 'stretchX'});
        const cid = parent.children().toArray().map(child => child.cid);

        expect(all[0]).to.deep.equal({top: 0, left: 0, right: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 0], left: 0, right: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 0], left: 0, right: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 0], left: 0, right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 0], left: 0, right: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 0], left: 0, right: 0});
      });

      it('renders children layoutData with spacing', function() {
        const all = render({spacing: 16, alignment: 'stretchX'});
        const cid = parent.children().toArray().map(child => child.cid);

        expect(all[0]).to.deep.equal({top: 0, left: 0, right: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 0, right: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], left: 0, right: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0, right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], left: 0, right: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 16], left: 0, right: 0});
      });

      it('renders children layoutData with dimension', function() {
        children[0].width = 100;
        children[1].height = 200;
        children[2].set({width: 300, height: 400});

        const all = render({spacing: 16, alignment: 'stretchX'});

        expect(all[0]).to.deep.equal({top: 0, left: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 0, right: 0, height: 200});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], left: 0, width: 300, height: 400});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0, right:0});
      });

      it('renders children layoutData with alternate alignment', function() {
        children[0].width = 100;
        children[1].left = 10;
        children[2].right = 10;
        children[3].set({left: 0, right: 0});
        children[4].set({centerX: 10});

        const all = render({spacing: 16, alignment: 'stretchX'});

        expect(all[0]).to.deep.equal({top: 0, left: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 10});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], right: 10});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0, right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], centerX: 10});
      });

    });

    describe('with alignment right', function() {

      it('renders children layoutData', function() {
        const all = render({alignment: 'right'});
        const cid = parent.children().toArray().map(child => child.cid);

        expect(all[0]).to.deep.equal({top: 0, right: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 0], right: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 0], right: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 0], right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 0], right: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 0], right: 0});
      });

      it('renders children layoutData with spacing', function() {
        const all = render({spacing: 16, alignment: 'right'});
        const cid = parent.children().toArray().map(child => child.cid);

        expect(all[0]).to.deep.equal({top: 0, right: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], right: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], right: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], right: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 16], right: 0});
      });

      it('renders children layoutData with dimension', function() {
        children[0].width = 100;
        children[1].height = 200;
        children[2].set({width: 300, height: 400});

        const all = render({spacing: 16, alignment: 'right'});

        expect(all[0]).to.deep.equal({top: 0, right: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], right: 0, height: 200});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], right: 0, width: 300, height: 400});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], right: 0});
      });

      it('renders children layoutData with alternate alignment', function() {
        children[0].width = 100;
        children[1].left = 10;
        children[2].right = 10;
        children[3].set({left: 0, right: 0});
        children[4].set({centerX: 10});

        const all = render({spacing: 16, alignment: 'right'});

        expect(all[0]).to.deep.equal({top: 0, right: 0, width: 100});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 10});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], right: 10});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0, right: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], centerX: 10});
      });

    });

    describe('with layoutData properties top/bottom', function() {

      it('adds top to spacing', function() {
        children[0].top = 10;
        children[1].top = 10;
        children[2].top = -10;
        children[3].top = -20;

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 10, left: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 26], left: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 6], left: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], -4], left: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], left: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 16], left: 0});
      });

      it('adds bottom to spacing', function() {
        children[0].top = 10;
        children[0].bottom = 10;
        children[1].bottom = -10;
        children[2].bottom = -20;

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 10, left: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 26], left: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 6], left: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], -4], left: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], left: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 16], left: 0});
      });

      it('adds top and bottom to spacing', function() {
        children[0].bottom = 10;
        children[1].top = 10;

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, left: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 36], left: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], left: 0});
      });

      it('supports height', function() {
        children[1].set({top: 10, bottom: 11, height: 12});

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, left: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 26], height: 12, left: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 27], left: 0});
      });

      it('vertically aligns to bottom when last child has bottom offset', function() {
        children[2].top = 30;
        children[3].bottom = -10;
        children[4].bottom = 30;
        children[5].top = 20;
        children[5].bottom = 10;

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({bottom: [cid[1], 16], left: 0});
        expect(all[1]).to.deep.equal({bottom: [cid[2], 46], left: 0});
        expect(all[2]).to.deep.equal({bottom: [cid[3], 16], left: 0});
        expect(all[3]).to.deep.equal({bottom: [cid[4], 6], left: 0});
        expect(all[4]).to.deep.equal({bottom: [cid[5], 66], left: 0});
        expect(all[5]).to.deep.equal({bottom: 10, left: 0});
      });

      it('stretches when first child has top and last child bottom offset', function() {
        children[0].top = 0;
        children[5].bottom = 0;

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, left: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], left: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0});
        expect(all[4]).to.deep.equal({top: [cid[3], 16], left: 0});
        expect(all[5]).to.deep.equal({top: [cid[4], 16], bottom: 0, left: 0});
      });

      it('stretches only child', function() {
        children = [new TextView()];
        children[0].set({top: 0, bottom: 0, height: 10});

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 0, bottom: 0, left: 0});
      });

      it('stretches first child to have top and bottom but not height', function() {
        children[0].top = 10;
        children[1].bottom = 11;
        children[2].set({top: 12, bottom: 13, height: 100});
        children[3].set({top: 14, bottom: 15});
        children[5].bottom = 15;

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 10, left: 0});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 0});
        expect(all[2]).to.deep.equal({top: [cid[1], 39], height: 100, left: 0});
        expect(all[3]).to.deep.equal({top: [cid[2], 43], bottom: [cid[4], 31], left: 0});
        expect(all[4]).to.deep.equal({bottom: [cid[5], 16], left: 0});
        expect(all[5]).to.deep.equal({bottom: 15, left: 0});
      });

      it('stretches only child to not have height', function() {
        children[0].set({top: 10, height: 10});
        children[1].set({height: 10});
        children[2].set({height: 10});
        children[4].set({height: 10});
        children[5].set({bottom: 10, height: 10});

        const all = render({spacing: 16, alignment: 'left'});

        expect(all[0]).to.deep.equal({top: 10, left: 0, height: 10});
        expect(all[1]).to.deep.equal({top: [cid[0], 16], left: 0, height: 10});
        expect(all[2]).to.deep.equal({top: [cid[1], 16], left: 0, height: 10});
        expect(all[3]).to.deep.equal({top: [cid[2], 16], left: 0, bottom: [cid[4], 16]});
        expect(all[4]).to.deep.equal({left: 0, bottom: [cid[5], 16], height: 10});
        expect(all[5]).to.deep.equal({left: 0, bottom: 10, height: 10});
      });

    });

  });

  describe('on Stack widget', function() {

    it('is the default layout', function() {
      expect(new StackComposite().layout).to.be.instanceof(StackLayout);
    });

    it('can be replaced in constructor', function() {
      const layout = new StackLayout();
      expect(new StackComposite({layout}).layout).to.equal(layout);
    });

    it('can not be replaced with ConstraintLayout in constructor', function() {
      const layout = new ConstraintLayout();
      expect(() => new StackComposite({layout})).to.throw();
    });

    it('can not be replaced later', function() {
      const layout = new StackLayout();
      const stack = new StackComposite({layout});

      stack.layout = layout;

      expect(stack.layout).to.equal(layout);
    });

    it('can be created by spacing parameter', function() {
      const layout = new StackComposite({spacing: 2}).layout;
      expect(layout.spacing).to.equal(2);
      expect(layout.alignment).to.equal('left');
    });

    it('can be created by alignment parameter', function() {
      const layout = new StackComposite({alignment: 'right'}).layout;
      expect(layout.spacing).to.equal(0);
      expect(layout.alignment).to.equal('right');
    });

    it('can be merged with spacing parameter', function() {
      const layout = new StackComposite({layout: new StackLayout(), spacing: 4}).layout;
      expect(layout.spacing).to.equal(4);
    });

    it('can be merged with alignment parameter', function() {
      const layout = new StackComposite({layout: new StackLayout(), alignment: 'right'}).layout;
      expect(layout.spacing).to.equal(0);
      expect(layout.alignment).to.deep.equal('right');
    });

    it('spacing can not be set later', function() {
      const stack = new StackComposite({spacing: 4});

      stack.spacing = 10;

      expect(stack.spacing).to.equal(4);
    });

    it('alignment can not be set later', function() {
      const stack = new StackComposite({alignment: 'right'});

      stack.alignment = 'left';

      expect(stack.alignment).to.equal('right');
    });

    it('alignment is included in toXML result', function() {
      stub(client, 'get').returns({});
      expect(new StackComposite()[toXML]())
        .to.match(/<StackComposite .* alignment='left'\/>/);
      expect(new StackComposite({alignment: 'right'})[toXML]())
        .to.match(/<StackComposite .* alignment='right'\/>/);
    });

  });

});