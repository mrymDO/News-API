import express from "express"
import articleController from "../controllers/articleController"

const router = express.Router()

router.post('/', articleController.add)
router.get('/', articleController.getAll)
router.get('/:id', articleController.get)
router.delete('/:id', articleController.delete)
router.put('/:id', articleController.update)



export default router