<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Services\Helpers;
use AppBundle\Services\JwtAuth;

use BackendBundle\Entity\Fleur;

class FleurController extends Controller{

	public function newAction(Request $request, $id=null){
		$helpers = $this->get(Helpers::class);
		$jwt_auth = $this->get(JwtAuth::class);

		$token = $request->get("authorization",null);
		$authCheck = $jwt_auth->checkToken($token);

		if($authCheck){
			$identity = $jwt_auth->checkToken($token, true);
			$json = $request->get("json",null);

			if($json != null){

				$params = json_decode($json);

				$createdAt = new \Datetime('now');
				$updatedAt = new \Datetime('now');
				// dump($updatedAt);
				// die;

				$user_id 	= ($identity->sub !=null) ? $identity->sub : null;
				$nom		= (isset($params->nom)) ? $params->nom : null;
				$description= (isset($params->description)) ? $params->description : null;
				$saison		= (isset($params->saison)) ? $params->saison : null;

				if($user_id != null && $nom !=null){

					$em = $this->getDoctrine()->getManager();
					$user = $em->getRepository('BackendBundle:User')->findOneBy(array(
						'id' => $user_id
					));

					if($id==null){
						$fleur = new Fleur();
						// $fleur->setUsers($user);
						$fleur->setNom($nom);
						$fleur->setDescription($description);
						$fleur->setSaison($saison);
						$fleur->setCreatedAt($createdAt);
						$fleur->setUpdatedAt($updatedAt);

						$em->persist($fleur);
						$em->flush();

						$data = array(
							"status" 	=> "success",
							"code" 		=> 200,
							"data" 		=> $fleur
						);
					}else{
						$fleur = $em->getRepository('BackendBundle:Fleur')->findOneBy(array(
								"id"=>$id
						));

						if(isset($identity->sub) && $identity->sub == $fleur->getUsers()->getId()){
							
							$fleur->setTitle($nom);
							$fleur->setDescription($description);
							$fleur->setStatus($saison);
							$fleur->setUpdatedAt($updatedAt);

							$em->persist($fleur);
							$em->flush();

							$data = array(
								"status" 	=> "success",
								"code" 		=> 200,
								"data" 		=> $fleur
							);

						}else{
							$data = array(
								"status" 	=> "error",
								"code" 		=> 400,
								"msg" 		=> "fleur updated error, you not owner"
							);
						}
					}

					

				}else{
					$data = array(
						"status" 	=> "error",
						"code" 		=> 400,
						"msg" 		=> "fleur not created, validation failed"
					);
				}

			}else{
				$data = array(
					"status" 	=> "error",
					"code" 		=> 400,
					"msg" 		=> "fleur not created, params failed"
				);
			}

			
		}else{
			$data = array(
				"status" 	=> "error",
				"code" 		=> 400,
				"msg" 		=> "Authorization not valid !!"
			);
		}

		return $helpers->json($data);
	}

	public function fleursAction(Request $request){
		$helpers = $this->get(Helpers::class);
		$jwt_auth = $this->get(JwtAuth::class);

		$token = $request->get("authorization",null);
		$authCheck = $jwt_auth->checkToken($token);

		if($authCheck){
			$identity = $jwt_auth->checkToken($token, true);
			
			$em = $this->getDoctrine()->getManager();

			$dql = "SELECT t FROM BackendBundle:Fleur t ORDER BY t.id DESC";
			$query = $em->createQuery($dql);

			$page = $request->query->getInt('page',1);
			$paginator = $this->get('knp_paginator');
			$items_per_page = 2;

			$pagination = $paginator->paginate($query, $page, $items_per_page);
			$total_items_count = $pagination->getTotalItemCount();

			$data = array(
				'status'=>'success',
				'code'	=>200,
				'total_items_count'	=> $total_items_count,
				'items_per_page' => $items_per_page,
				'total_pages' => ceil($total_items_count / $items_per_page),
				'data'=>$pagination
			);

		}else{
			$data = array(
				'status'=>'error',
				'code'	=>400,
				'msg'	=>'Authorization not valid'
			);
		}

		return $helpers->json($data);
	}

	public function fleurAction(Request $request, $id = null){
		$helpers = $this->get(Helpers::class);
		$jwt_auth = $this->get(JwtAuth::class);

		$token = $request->get("authorization",null);
		$authCheck = $jwt_auth->checkToken($token);

		if($authCheck){
			$identity = $jwt_auth->checkToken($token, true);

			$em = $this->getDoctrine()->getManager();
			$task = $em->getRepository('BackendBundle:Fleur')->findOneBy(array(
				'id'=>$id
			));

			if($fleur && is_object($fleur) && $identity->sub == $fleur->getUsers()->getId()) {
				$data = array(
					'status'=>'success',
					'code'	=>200,
					'data'	=>$fleur,
					'msg'	=>'fleur detail'
				);
			}else{
				$data = array(
					'status'=>'error',
					'code'	=>400,
					'msg'	=>'fleur not found'
				);
			}

			
		}else{
			$data = array(
				'status'=>'error',
				'code'	=>400,
				'msg'	=>'Authorization not valid'
			);
		}

		return $helpers->json($data);
	}

	public function searchAction(Request $request, $search = null){
		$helpers = $this->get(Helpers::class);
		$jwt_auth = $this->get(JwtAuth::class);

		$token = $request->get("authorization",null);
		$authCheck = $jwt_auth->checkToken($token);

		if($authCheck){
			$identity = $jwt_auth->checkToken($token, true);

			$em = $this->getDoctrine()->getManager();

			//search filter

			$filter = $request->get('filter',null);
			if(empty($filter)){
				$filter=null;
			}elseif($filter == 1){
				$filter='new';
			}else if($filter == 2){
				$filter='todo';
			}else{
				$filter = "finished";
			}

			//order
			$order = $request->get('order',null);
			if(empty($order) || $order == 2){
				$order = 'DESC';
			}else{
				$order = 'ASC';
			}

			//Search
			if($search != null){
				$dql = "SELECT t FROM BackendBundle:Fleur t"
						." WHERE t.users = $identity->sub AND "
						."(t.title LIKE :search OR t.description LIKE :search) ";
			}else{
				$dql = "SELECT t FROM BackendBundle:Fleur t "
						." WHERE t.users = $identity->sub";
			}

			//set filter
			if($filter != null){
				$dql .="AND t.saison = :filter";
			}

			//set order
			$dql .=" ORDER BY t.id $order";
			//die();
			

			$query = $em->createQuery($dql);

			//Set filter parameter
			if($filter != null){
				$query->setParameter('filter', "$filter");
			}

			//Set search
			if(!empty($search)){
				$query->setParameter('search', "%$search%");
			}

			$fleurs = $query->getResult();

			$data = array(
					'status' => 'success',
					'code'	 => 200,
					'data'	 => $fleurs
				);


		}else{
			$data = array(
				'status'=>'error',
				'code'	=>400,
				'msg'	=>'Authorization not valid'
			);
		}
		return $helpers->json($data);
	}

	public function removeAction(Request $request, $id = null){
		$helpers = $this->get(Helpers::class);
		$jwt_auth = $this->get(JwtAuth::class);

		$token = $request->get("authorization",null);
		$authCheck = $jwt_auth->checkToken($token);

		if($authCheck){

			$identity = $jwt_auth->checkToken($token, true);

			$em = $this->getDoctrine()->getManager();
			$fleur = $em->getRepository('BackendBundle:Fleur')->findOneBy(array(
				'id'=>$id
			));

			if($fleur && is_object($fleur) && $identity->sub == $fleur->getUsers()->getId()) {
				
				$em->remove($fleur);//delete the table register
				$em->flush();

				$data = array(
					'status'=>'success',
					'code'	=>200,
					'msg'	=>$fleur
				);
			}else{
				$data = array(
					'status'=>'error',
					'code'	=>400,
					'msg'	=>'Task not found'
				);
			}


		}else{
			$data = array(
				'status'=>'error',
				'code'	=>400,
				'msg'	=>'Authorization not valid'
			);
		}

		return $helpers->json($data);
	}
}