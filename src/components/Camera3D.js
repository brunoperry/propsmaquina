import Mat4 from "../core/math/Mat4.js";
import Input from "../input/Input.js";
import Vec4 from "../core/math/Vec4.js";
import Transform from "./Transform.js";
import Util from "../utils/Util.js";

class Camera3D {

	constructor(fov, aspectRatio, zNear = 0.1, zFar = 1000.0) {

		this.projection = new Mat4().perspective(fov, aspectRatio, zNear, zFar);
		this.transform = new Transform();
	}
	
	resetTarget(target) {

		this.projection = new Mat4().perspective(parseFloat(Utils.toRadians(70.0)),
			parseFloat(target.getWidth()) / parseFloat(target.getHeight()),
			0.1,
			1000.0);
	}

	reset() {

		this.transform = new Transform();
	}

	//PARAMS: float
	setPerspective(angle) {

		this.projection = new Mat4().perspective(parseFloat(Utils.toRadians(angle)),
			parseFloat(target.getWidth()) / parseFloat(target.getHeight()),
			0.1,
			1000.0);
	}

	getViewProjection() {

		//Mat4
		var cameraRotation = this.getTransform().getTransformedRot().conjugate().toRotationMatrix();
		//Vec4
		var cameraPos = this.getTransform().getTransformedPos().multiply(-1);
		//Mat4
		var cameraTranslation = new Mat4().translation(cameraPos.getX(), cameraPos.getY(), cameraPos.getZ());

		return this.projection.multiply(cameraRotation.multiply(cameraTranslation));
	}

	//Input, float
	updateInput(input, delta) {

		// Speed and rotation amounts are hardcoded here.
		// In a more general system, you might want to have them as variables.
		//floats
		var sensitivityX = 2.66 * delta;
		var sensitivityY = 2.0 * delta;
		var movAmt = 5.0 * delta;

		switch (input.getKey()) {
			case Input.Key.W:
				this.move(this.getTransform().getRot().getForward(), movAmt);
				break;
			case Input.Key.A:
				this.move(this.getTransform().getRot().getLeft(), movAmt);
				break;
			case Input.Key.S:
				this.move(this.getTransform().getRot().getForward(), -movAmt);
				break;
			case Input.Key.D:
				this.move(this.getTransform().getRot().getRight(), movAmt);
				break;
			case Input.Key.RIGHT:
				this.rotate(Camera.Y_AXIS, sensitivityX);
				break;
			case Input.Key.LEFT:
				this.rotate(Camera.Y_AXIS, -sensitivityX);
				break;
			case Input.Key.DOWN:
				this.rotate(this.getTransform().getRot().getRight(), sensitivityY);
				break;
			case Input.Key.UP:
				this.rotate(this.getTransform().getRot().getRight(), -sensitivityY);
				break;
		}
	}

	moveTo(to, tick) {

		this.transform = this.getTransform().setPos(this.getTransform().getPos().lerp(to, tick));
		if (this.getTransform().getPos() >= to.z) {
			this.getTransform().getPos().z = to.z;
			return;
		}
	}

	move(pos) {

		this.transform = this.transform.setPos(pos);
	}

	//Vec4, float
	rotate(axis, angle) {


		this.transform = this.getTransform().rotate(new Quaternion({
			type: Quaternion.Type.INIT_VEC_ANGLE,
			vec: axis,
			angle: angle
		}));
	}

	lookAt(point, up) {
		this.transform = this.transform.lookAt(point, up);
	}

	//returns Transform
	getTransform() {
		return this.transform;
	}
}

Camera3D.Y_AXIS = new Vec4(0, 1, 0);
Camera3D.FOV = parseFloat(Util.toRadians(70.0));

export default Camera3D;