<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Services\Helpers;
use AppBundle\Services\JwtAuth;

use BackendBundle\Entity\Produit;

class ProduitController extends Controller{

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
				$categorie		= (isset($params->categorie)) ? $params->categorie : null;
				$description= (isset($params->description)) ? $params->description : null;
				$prix= (isset($params->prix)) ? $params->prix : null;

				if($user_id != null && $nom !=null){

					$em = $this->getDoctrine()->getManager();
					$user = $em->getRepository('BackendBundle:User')->findOneBy(array(
						'id' => $user_id
					));

					if($id==null){
						$produit = new Produit();
						// $fleur->setUsers($user);
						$produit->setNom($nom);
						$produit->setDescription($description);
						$produit->setCategorie($categorie);
						$produit->setPrix($prix);
						$produit->setUser($user);
						$produit->setCreatedAt($createdAt);
						$produit->setUpdatedAt($updatedAt);

						$em->persist($produit);
						$em->flush();

						$data = array(
							"status" 	=> "success",
							"code" 		=> 200,
							"data" 		=> $produit
						);
					}else{
						$produit = $em->getRepository('BackendBundle:Produit')->findOneBy(array(
								"id"=>$id
						));

						if(isset($identity->sub) && $identity->sub == $produit->getUsers()->getId()){
							
							$produit->setTitle($nom);
							$produit->setDescription($description);
							$produit->setCategorie($categorie);
							$produit->setUpdatedAt($updatedAt);
							$produit->setPrix($prix);

							$em->persist($produit);
							$em->flush();

							$data = array(
								"status" 	=> "success",
								"code" 		=> 200,
								"data" 		=> $produit
							);

						}else{
							$data = array(
								"status" 	=> "error",
								"code" 		=> 400,
								"msg" 		=> "produit updated error, you not owner"
							);
						}
					}

					

				}else{
					$data = array(
						"status" 	=> "error",
						"code" 		=> 400,
						"msg" 		=> "produit not created, validation failed"
					);
				}

			}else{
				$data = array(
					"status" 	=> "error",
					"code" 		=> 400,
					"msg" 		=> "produit not created, params failed"
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

	public function produitsAction(Request $request){
		$helpers = $this->get(Helpers::class);
		$jwt_auth = $this->get(JwtAuth::class);

		$token = $request->get("authorization",null);
		$authCheck = $jwt_auth->checkToken($token);

		if($authCheck){
			$identity = $jwt_auth->checkToken($token, true);
			
			$em = $this->getDoctrine()->getManager();

			$dql = "SELECT t FROM BackendBundle:Produit t ORDER BY t.id DESC";
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

	public function produitAction(Request $request, $id = null){
		$helpers = $this->get(Helpers::class);
		$jwt_auth = $this->get(JwtAuth::class);

		$token = $request->get("authorization",null);
		$authCheck = $jwt_auth->checkToken($token);

		if($authCheck){
			$identity = $jwt_auth->checkToken($token, true);

			$em = $this->getDoctrine()->getManager();
			$produit = $em->getRepository('BackendBundle:Produit')->findOneBy(array(
				'id'=>$id
			));

			if($produit && is_object($produit) && $identity->sub == $produit->getUser()->getId()) {
				$data = array(
					'status'=>'success',
					'code'	=>200,
					'data'	=>$produit,
					'msg'	=>'produit detail'
				);
			}else{
				$data = array(
					'status'=>'error',
					'code'	=>400,
					'msg'	=>'produit not found'
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
				$dql = "SELECT t FROM BackendBundle:Produit t"
						." WHERE t.users = $identity->sub AND "
						."(t.title LIKE :search OR t.description LIKE :search) ";
			}else{
				$dql = "SELECT t FROM BackendBundle:Produit t "
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

			$produits = $query->getResult();

			$data = array(
					'status' => 'success',
					'code'	 => 200,
					'data'	 => $produits
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
			$produit = $em->getRepository('BackendBundle:Produit')->findOneBy(array(
				'id'=>$id
			));

			if($produit && is_object($produit) && $identity->sub == $produit->getUsers()->getId()) {
				
				$em->remove($produit);//delete the table register
				$em->flush();

				$data = array(
					'status'=>'success',
					'code'	=>200,
					'msg'	=>$produit
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